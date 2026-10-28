// Recebe os avisos do Asaas (pagamento confirmado, vencido, assinatura cancelada) e atualiza o perfil.
// Publicar sem checagem de login: supabase functions deploy asaas-webhook --no-verify-jwt
// O Asaas manda o token configurado no cabeçalho asaas-access-token.
// Arquivo único para colar no painel do Supabase (Edge Functions > Deploy a new function > Via Editor).

// Peças usadas pelas três funções: resposta JSON, cliente do Supabase e chamadas ao Asaas.
import { createClient } from 'jsr:@supabase/supabase-js@2';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

// Confere o login de quem chamou. Devolve o usuário ou null.
export async function usuario(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false }
  });
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

const BASE = Deno.env.get('ASAAS_AMBIENTE') === 'producao' ? 'https://api.asaas.com/v3' : 'https://api-sandbox.asaas.com/v3';

export async function asaas(caminho: string, init: { method?: string; body?: unknown } = {}) {
  const res = await fetch(BASE + caminho, {
    method: init.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'atalho-plantao',
      access_token: Deno.env.get('ASAAS_API_KEY')!
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body)
  });
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = dados?.errors?.[0]?.description ?? `Asaas respondeu ${res.status}`;
    throw new Error(msg);
  }
  return dados;
}

// Data de hoje no fuso de São Paulo, em AAAA-MM-DD.
export const hojeBR = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

export function somaDias(iso: string, dias: number) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function somaMes(iso: string, meses: number) {
  const d = new Date(iso + 'T12:00:00Z');
  const dia = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + meses);
  const ultimo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(dia, ultimo));
  return d.toISOString().slice(0, 10);
}


function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('ok');
  const esperado = Deno.env.get('ASAAS_WEBHOOK_TOKEN') ?? '';
  if (!esperado || !iguais(req.headers.get('asaas-access-token') ?? '', esperado)) return new Response('proibido', { status: 401 });

  const ev = await req.json().catch(() => null);
  if (!ev?.event) return json({ ok: true });
  const db = admin();

  const id = String(ev.id ?? `${ev.event}:${ev.payment?.id ?? ev.subscription?.id ?? ''}:${ev.dateCreated ?? ''}`);
  const { error: dup } = await db.from('webhook_eventos').insert({ id, evento: ev.event, payload: ev });
  if (dup && dup.code === '23505') return json({ ok: true, repetido: true });

  const sub = ev.payment?.subscription ?? ev.subscription?.id ?? null;
  const cli = ev.payment?.customer ?? ev.subscription?.customer ?? null;
  let q = db.from('perfis').select('id,pago_ate,asaas_subscription_id');
  q = sub ? q.eq('asaas_subscription_id', sub) : q.eq('asaas_customer_id', cli);
  let { data: perfil } = await q.maybeSingle();
  if (!perfil && cli) ({ data: perfil } = await db.from('perfis').select('id,pago_ate,asaas_subscription_id').eq('asaas_customer_id', cli).maybeSingle());
  if (!perfil) return json({ ok: true, semPerfil: true });

  const mudar: Record<string, unknown> = {};
  switch (ev.event) {
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED': {
      // Acesso vai até um mês depois do vencimento pago, com 5 dias de folga.
      const ate = somaDias(somaMes(ev.payment.dueDate, 1), 5);
      mudar.status = 'ativa';
      mudar.pago_ate = perfil.pago_ate && perfil.pago_ate > ate ? perfil.pago_ate : ate;
      break;
    }
    case 'PAYMENT_OVERDUE':
      mudar.status = 'atrasada';
      break;
    case 'PAYMENT_REFUNDED':
    case 'PAYMENT_CHARGEBACK_REQUESTED':
      mudar.status = 'atrasada';
      mudar.pago_ate = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
      break;
    case 'SUBSCRIPTION_DELETED':
    case 'SUBSCRIPTION_INACTIVATED':
      mudar.status = 'cancelada';
      if (perfil.asaas_subscription_id === sub) mudar.asaas_subscription_id = null;
      break;
    default:
      return json({ ok: true, ignorado: ev.event });
  }
  const { error } = await db.from('perfis').update(mudar).eq('id', perfil.id);
  if (error) { console.error('webhook', error); return json({ erro: 'falha ao salvar' }, 500); }
  return json({ ok: true });
});
