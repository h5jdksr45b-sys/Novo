// Exclui a conta de quem chamou: cancela a assinatura no Asaas e apaga o usuário.
// Locais, plantões e perfil somem junto (on delete cascade).
import { admin, asaas, cors, json, usuario } from '../_shared/comum.ts';

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
