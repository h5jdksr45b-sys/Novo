// Assinar ou cancelar. Chamada pelo app com o login de quem está usando.
// Corpo: { acao: 'assinar', cpfCnpj } ou { acao: 'cancelar' }.
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


Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ erro: 'Método não aceito.' }, 405);
  try {
    const user = await usuario(req);
    if (!user) return json({ erro: 'Sua sessão expirou. Entre de novo.' }, 401);
    const { acao, cpfCnpj } = await req.json().catch(() => ({}));
    const db = admin();
    const { data: perfil, error } = await db.from('perfis').select('*').eq('id', user.id).single();
    if (error || !perfil) return json({ erro: 'Perfil não encontrado. Saia e entre de novo.' }, 404);

    if (acao === 'cancelar') {
      if (!perfil.asaas_subscription_id) return json({ erro: 'Você não tem assinatura ativa.' }, 400);
      await asaas(`/subscriptions/${perfil.asaas_subscription_id}`, { method: 'DELETE' });
      await db.from('perfis').update({ status: 'cancelada', asaas_subscription_id: null }).eq('id', user.id);
      return json({ ok: true });
    }

    if (acao !== 'assinar') return json({ erro: 'Ação desconhecida.' }, 400);

    // Já tem assinatura: devolve o link da cobrança em aberto, se houver.
    if (perfil.asaas_subscription_id) {
      const pg = await asaas(`/subscriptions/${perfil.asaas_subscription_id}/payments?status=PENDING&limit=1`);
      const venc = pg?.data?.[0];
      if (venc?.invoiceUrl) return json({ url: venc.invoiceUrl });
      const atr = await asaas(`/subscriptions/${perfil.asaas_subscription_id}/payments?status=OVERDUE&limit=1`);
      if (atr?.data?.[0]?.invoiceUrl) return json({ url: atr.data[0].invoiceUrl });
      return json({ mensagem: 'Sua assinatura está em dia. A próxima cobrança chega por e-mail.' });
    }

    const doc = String(cpfCnpj ?? '').replace(/\D/g, '');
    if (doc.length !== 11 && doc.length !== 14) return json({ erro: 'Digite um CPF (11 números) ou CNPJ (14 números).' }, 400);
    const valor = Number(Deno.env.get('ASSINATURA_VALOR'));
    if (!(valor > 0)) return json({ erro: 'A assinatura ainda não está disponível. Fale com o suporte.' }, 503);

    let cliente = perfil.asaas_customer_id as string | null;
    if (!cliente) {
      const c = await asaas('/customers', {
        method: 'POST',
        body: { name: perfil.nome || user.email, email: user.email, cpfCnpj: doc, externalReference: user.id }
      });
      cliente = c.id;
      await db.from('perfis').update({ asaas_customer_id: cliente }).eq('id', user.id);
    }

    // A primeira cobrança vence no fim do teste grátis, ou hoje se o teste já acabou.
    const hoje = hojeBR();
    const primeira = perfil.status === 'teste' && perfil.teste_ate > hoje ? perfil.teste_ate : hoje;
    const sub = await asaas('/subscriptions', {
      method: 'POST',
      body: {
        customer: cliente,
        billingType: 'UNDEFINED',
        value: valor,
        nextDueDate: primeira,
        cycle: 'MONTHLY',
        description: Deno.env.get('ASSINATURA_DESCRICAO') || 'Atalho Plantão, assinatura mensal',
        externalReference: user.id
      }
    });
    await db.from('perfis').update({ asaas_subscription_id: sub.id }).eq('id', user.id);

    const pg = await asaas(`/subscriptions/${sub.id}/payments?limit=1`);
    return json({ url: pg?.data?.[0]?.invoiceUrl ?? null, mensagem: 'Assinatura criada. A cobrança chega por e-mail.' });
  } catch (e) {
    console.error('assinatura', e);
    return json({ erro: `Não deu certo agora: ${(e as Error).message}` }, 500);
  }
});
