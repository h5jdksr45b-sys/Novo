// Assinar ou cancelar. Chamada pelo app com o login de quem está usando.
// Corpo: { acao: 'assinar', cpfCnpj } ou { acao: 'cancelar' }.
import { admin, asaas, cors, hojeBR, json, usuario } from '../_shared/comum.ts';

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
