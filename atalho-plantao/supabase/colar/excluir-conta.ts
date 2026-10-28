// Exclui a conta de quem chamou: cancela a assinatura no Asaas e apaga o usuário.
// Locais, plantões e perfil somem junto (on delete cascade).
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
  const user = await usuario(req);
  if (!user) return json({ erro: 'Sua sessão expirou. Entre de novo.' }, 401);
  const db = admin();
  const { data: perfil } = await db.from('perfis').select('asaas_subscription_id').eq('id', user.id).maybeSingle();
  if (perfil?.asaas_subscription_id) {
    try { await asaas(`/subscriptions/${perfil.asaas_subscription_id}`, { method: 'DELETE' }); }
    catch (e) { console.error('cancelar ao excluir', e); }
  }
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return json({ erro: 'Não deu para excluir agora. Tente de novo em instantes.' }, 500);
  return json({ ok: true });
});
