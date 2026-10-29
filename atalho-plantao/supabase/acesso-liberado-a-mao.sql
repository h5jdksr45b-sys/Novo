-- Atalho Plantão: compra única (Hotmart) com acesso liberado à mão pelo dono do app.
-- Rode uma vez no SQL Editor, depois do schema.sql. Pode rodar de novo sem problema.
-- Quem administra: troque o e-mail abaixo se for entrar no app com outro.

create or replace function public.eh_admin()
returns boolean language sql stable security definer set search_path = public, auth as $$
  select coalesce((select lower(email) from auth.users where id = auth.uid()) in ('drfabioschmidt@gmail.com'), false);
$$;

-- E-mails liberados antes de a pessoa criar a conta. A liberação entra sozinha no primeiro login.
create table if not exists public.acesso_pendente (
  email text primary key,
  criado_em timestamptz not null default now()
);
alter table public.acesso_pendente enable row level security;
revoke all on public.acesso_pendente from anon, authenticated;

-- Acesso para sempre = pago_ate muito no futuro. Não precisa mudar acesso_liberado() nem as regras das tabelas.
create or replace function public.criar_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id) values (new.id) on conflict (id) do nothing;
  if exists (select 1 from public.acesso_pendente where email = lower(new.email)) then
    update public.perfis set pago_ate = date '2999-12-31', status = 'ativa' where id = new.id;
    delete from public.acesso_pendente where email = lower(new.email);
  end if;
  return new;
end $$;

-- Liberar (p_liberar = true) ou tirar (false) o acesso de um e-mail.
-- Responde 'liberado', 'pendente' (ainda sem conta; libera no primeiro login) ou 'retirado'.
create or replace function public.liberar_acesso(p_email text, p_liberar boolean default true)
returns text language plpgsql security definer set search_path = public, auth as $$
declare
  v_email text := lower(trim(p_email));
  v_id uuid;
begin
  if not public.eh_admin() then raise exception 'sem permissão' using errcode = '42501'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'e-mail inválido' using errcode = '22023'; end if;
  select id into v_id from auth.users where lower(email) = v_email;
  if p_liberar then
    if v_id is null then
      insert into public.acesso_pendente (email) values (v_email) on conflict (email) do nothing;
      return 'pendente';
    end if;
    update public.perfis set pago_ate = date '2999-12-31', status = 'ativa' where id = v_id;
    return 'liberado';
  end if;
  delete from public.acesso_pendente where email = v_email;
  if v_id is not null then
    update public.perfis set pago_ate = null, status = 'teste' where id = v_id;
  end if;
  return 'retirado';
end $$;

-- Lista para a tela do administrador: contas e liberações à espera de cadastro.
create or replace function public.listar_contas()
returns table (email text, criado_em timestamptz, teste_ate date, liberado boolean, pendente boolean)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.eh_admin() then raise exception 'sem permissão' using errcode = '42501'; end if;
  return query
    select lower(u.email)::text, p.criado_em, p.teste_ate, coalesce(p.pago_ate >= date '2900-01-01', false), false
      from public.perfis p join auth.users u on u.id = p.id
    union all
    select a.email, a.criado_em, null::date, true, true from public.acesso_pendente a
    order by 2 desc
    limit 300;
end $$;

revoke all on function public.eh_admin() from public, anon;
revoke all on function public.liberar_acesso(text, boolean) from public, anon;
revoke all on function public.listar_contas() from public, anon;
grant execute on function public.eh_admin() to authenticated;
grant execute on function public.liberar_acesso(text, boolean) to authenticated;
grant execute on function public.listar_contas() to authenticated;
