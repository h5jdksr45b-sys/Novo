-- Atalho Plantão: banco de dados no Supabase.
-- Rode tudo de uma vez no SQL Editor do projeto (Supabase > SQL Editor > New query > Run).
-- Regra central: cada médico só lê e grava as próprias linhas (Row Level Security).
-- Lançar e editar exige acesso liberado (teste grátis ou mensalidade paga). Ler, exportar e apagar sempre pode.

create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '' check (char_length(nome) <= 80),
  status text not null default 'teste' check (status in ('teste', 'ativa', 'atrasada', 'cancelada')),
  teste_ate date not null default (current_date + 14),
  pago_ate date,
  asaas_customer_id text,
  asaas_subscription_id text,
  iniciado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists public.locais (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 40),
  nome text not null check (char_length(nome) between 1 and 60),
  valor numeric(12, 2) not null check (valor > 0),
  prazo integer not null check (prazo between 0 and 365),
  forma text not null check (forma in ('PJ', 'RPA', 'CLT', 'Cooperativa')),
  exemplo boolean not null default false,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.plantoes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 40),
  local_id text not null,
  data date not null,
  venc date not null,
  turno text not null check (turno in ('12h', '24h', 'outro')),
  horas numeric(4, 1) check (horas is null or horas between 1 and 48),
  valor numeric(12, 2) not null check (valor > 0),
  obs text not null default '' check (char_length(obs) <= 140),
  pagamentos jsonb not null default '[]'::jsonb check (jsonb_typeof(pagamentos) = 'array'),
  exemplo boolean not null default false,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, id),
  foreign key (user_id, local_id) references public.locais (user_id, id) on delete restrict
);

-- Eventos recebidos do Asaas, para não processar o mesmo duas vezes e para auditoria.
create table if not exists public.webhook_eventos (
  id text primary key,
  evento text not null,
  payload jsonb not null,
  recebido_em timestamptz not null default now()
);

-- Cria o perfil assim que a pessoa entra pela primeira vez.
create or replace function public.criar_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();

-- Acesso liberado: teste grátis em dia ou mensalidade paga até hoje.
create or replace function public.acesso_liberado()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.perfis p
    where p.id = auth.uid()
      and ((p.status = 'teste' and p.teste_ate >= current_date)
           or (p.pago_ate is not null and p.pago_ate >= current_date))
  );
$$;

alter table public.perfis enable row level security;
alter table public.locais enable row level security;
alter table public.plantoes enable row level security;
alter table public.webhook_eventos enable row level security;

-- Perfil: a pessoa lê o próprio e só muda nome e iniciado. Situação da assinatura só o servidor muda.
drop policy if exists perfil_ler on public.perfis;
create policy perfil_ler on public.perfis for select using (id = auth.uid());
drop policy if exists perfil_mudar on public.perfis;
create policy perfil_mudar on public.perfis for update using (id = auth.uid()) with check (id = auth.uid());
revoke insert, update, delete on public.perfis from anon, authenticated;
grant select on public.perfis to authenticated;
grant update (nome, iniciado) on public.perfis to authenticated;

-- Locais e plantões: ler e apagar sempre; criar e mudar só com acesso liberado.
do $$
declare t text;
begin
  foreach t in array array['locais', 'plantoes'] loop
    execute format('drop policy if exists ler on public.%I', t);
    execute format('create policy ler on public.%I for select using (user_id = auth.uid())', t);
    execute format('drop policy if exists criar on public.%I', t);
    execute format('create policy criar on public.%I for insert with check (user_id = auth.uid() and public.acesso_liberado())', t);
    execute format('drop policy if exists mudar on public.%I', t);
    execute format('create policy mudar on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid() and public.acesso_liberado())', t);
    execute format('drop policy if exists apagar on public.%I', t);
    execute format('create policy apagar on public.%I for delete using (user_id = auth.uid())', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- webhook_eventos fica sem política: só as funções do servidor (chave service_role) acessam.
revoke all on public.webhook_eventos from anon, authenticated;
