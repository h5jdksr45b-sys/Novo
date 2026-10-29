# Atalho Plantão: como ligar o login e a assinatura

Sem esta configuração o app funciona só no aparelho, sem conta. Com ela, cada médico entra com o e-mail, os dados ficam guardados na conta dele, e o acesso depende do teste grátis de 14 dias ou da mensalidade paga.

Tempo estimado: uma hora, sem programar. Você vai criar três contas (Supabase, Asaas e um serviço de e-mail), copiar algumas chaves e colar comandos.

## Agora: senha simples, sem login (29/10/2026)

O app está no modo mais simples: sem conta, sem Supabase, com senha. A pessoa digita a senha uma vez e o aparelho fica liberado. Os plantões ficam guardados no próprio celular.

- Senhas em `senhas`, dentro do `index.html`: uma para quem compra e uma de cortesia. O arquivo guarda só o código de cada senha.
- Para criar outra senha, abra o app no navegador do computador, abra o console e rode `codigoSenha('NOVA SENHA')`. Acrescente o resultado na lista.
- Quem já entrou continua entrando mesmo se a senha sair da lista.

Para voltar ao login com conta, preencha `supabaseUrl` com `https://zjhpeiynrkgrudqqxlvl.supabase.co` e `supabaseAnonKey` com a chave anon do projeto (Supabase > Project Settings > API Keys > Legacy). Tudo abaixo continua valendo.

## Venda: compra única pela Hotmart, acesso liberado à mão

Desde 29/10/2026 o app vende acesso por compra única na Hotmart, sem mensalidade. O Asaas e as funções `assinatura` e `asaas-webhook` ficam guardados, mas o app não usa mais.

1. Depois do `schema.sql`, rode também `supabase/acesso-liberado-a-mao.sql` no SQL Editor. Ele cria a área Liberar acesso, que só aparece em Ajustes para o e-mail de administrador escrito no começo do arquivo.
2. Crie o produto na Hotmart e cole o link do checkout em `linkCompra`, no `index.html`. O app abre o checkout com o e-mail da conta já preenchido.
3. Chegou venda: abra o app com o seu e-mail, vá em Ajustes > Liberar acesso, digite o e-mail do comprador e toque em Liberar acesso. Se a pessoa ainda não criou a conta, o acesso entra sozinho no primeiro login.

## 1. Supabase (login e banco de dados)

1. Crie a conta em supabase.com e um projeto novo. Região: **São Paulo (sa-east-1)**. Guarde a senha do banco.
2. Em **SQL Editor > New query**, cole todo o conteúdo de `supabase/schema.sql` e toque em **Run**. Deve aparecer "Success".
3. Em **Authentication > Sign In / Providers > Email**: deixe ligado e desligue "Confirm email" (o código já confirma).
4. Em **Authentication > Emails > Magic Link**, troque o texto do e-mail para mostrar o código:

   ```
   <h2>Seu código do Atalho Plantão</h2>
   <p>Digite este código no app: <strong>{{ .Token }}</strong></p>
   <p>Ele vale por uma hora. Se não foi você, ignore este e-mail.</p>
   ```
   Assunto: `Seu código do Atalho Plantão`.
5. **E-mail próprio (obrigatório para uso real).** O envio que vem com o Supabase manda poucos e-mails por hora e serve só para teste. Crie conta no Resend ou no Brevo, confirme o seu domínio e preencha em **Authentication > Emails > SMTP Settings**.
6. Em **Authentication > URL Configuration**, ponha o endereço onde o app vai ficar (ex.: `https://plantao.seudominio.com.br`) em Site URL e em Redirect URLs.
7. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**. Elas são públicas e vão dentro do `index.html`:

   ```js
   window.ATALHO_CONFIG = {
     supabaseUrl: 'https://xxxx.supabase.co',
     supabaseAnonKey: 'eyJ...',
     entrarComGoogle: false,
     precoTexto: ''
   };
   ```
   Deixe `precoTexto` vazio enquanto o preço não for divulgado.

Nunca coloque a chave **service_role** no `index.html`. Ela só vai nos segredos das funções (passo 3).

## 2. Asaas (cobrança mensal por Pix, boleto ou cartão)

1. Crie a conta em asaas.com com o CNPJ que vai receber. Para testar antes, crie também uma conta no ambiente de testes (sandbox.asaas.com).
2. Em **Integrações > Chave de API**, gere a chave. Copie e guarde: ela não aparece de novo.
3. O webhook fica para o passo 4, depois de publicar as funções.

## 3. Publicar as funções do servidor

No computador, com o Node instalado, abra o terminal dentro da pasta `atalho-plantao` e rode:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase secrets set ASAAS_API_KEY='sua_chave' ASAAS_AMBIENTE=sandbox ASAAS_WEBHOOK_TOKEN='invente_uma_senha_longa' ASSINATURA_VALOR=00.00 ASSINATURA_DESCRICAO='Atalho Plantão, assinatura mensal'
npx supabase functions deploy assinatura
npx supabase functions deploy excluir-conta
npx supabase functions deploy asaas-webhook --no-verify-jwt
```

- `SEU_PROJECT_REF` é o trecho `xxxx` da Project URL.
- Troque `00.00` pelo valor da mensalidade, com ponto (ex.: `39.90`). Esse valor fica só no servidor; o app não mostra preço enquanto `precoTexto` estiver vazio.
- Quando for cobrar de verdade, troque `ASAAS_AMBIENTE=sandbox` por `ASAAS_AMBIENTE=producao` e use a chave da conta de produção.

## 4. Ligar o aviso do Asaas (webhook)

No Asaas, **Integrações > Webhooks > Adicionar**:

- URL: `https://xxxx.supabase.co/functions/v1/asaas-webhook`
- Token de autenticação: o mesmo `ASAAS_WEBHOOK_TOKEN` do passo 3
- Versão da API: v3. Fila: sincronizada.
- Eventos: Pagamento confirmado, Pagamento recebido, Pagamento vencido, Pagamento estornado, Chargeback solicitado, Assinatura removida, Assinatura inativada.

## 5. Publicar o app

O app é um arquivo só (`index.html`). Pode ir para Netlify, Vercel, Cloudflare Pages ou GitHub Pages. Arraste a pasta `atalho-plantao` no Netlify Drop (app.netlify.com/drop) para um teste rápido. Depois ligue o seu domínio.

## 6. Teste completo antes de abrir para outros médicos

1. Abra o app, entre com seu e-mail, digite o código. Deve aparecer o passo a passo.
2. Cadastre um local e lance um plantão. Feche o navegador, abra em outro aparelho, entre de novo: o plantão tem que estar lá.
3. Entre com um segundo e-mail: ele não pode ver nada do primeiro.
4. Em Ajustes, toque em Assinar, use um CPF de teste e pague no ambiente de testes do Asaas. Toque em "Já paguei, atualizar": a situação muda para "Assinatura ativa".
5. No SQL Editor, rode `update perfis set teste_ate = current_date - 1, pago_ate = null, status = 'teste';` para simular o fim do teste. O app tem que mostrar "Acesso pausado", deixar ver e exportar, e bloquear Lançar.
6. Exclua a conta de teste em Ajustes e confira em **Authentication > Users** que ela sumiu.

## Como funciona, em resumo

- **Login:** código de 6 dígitos por e-mail. Sem senha.
- **Dados:** tabelas `locais` e `plantoes` com regra de que cada linha só é vista e gravada pelo dono. Nenhum dado de paciente.
- **Teste grátis:** 14 dias a partir do primeiro login (`teste_ate` em `perfis`).
- **Mensalidade:** a primeira cobrança vence no fim do teste. Cada pagamento confirmado libera um mês e cinco dias de acesso.
- **Atraso ou cancelamento:** o acesso segue até a data paga. Depois, o médico vê e exporta tudo, mas não lança nem edita.
- **Sem internet:** o app guarda as mudanças no aparelho e envia quando a conexão voltar.
- **Excluir conta:** cancela a assinatura no Asaas e apaga usuário, locais e plantões.
