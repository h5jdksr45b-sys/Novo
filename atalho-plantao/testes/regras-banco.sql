\set ON_ERROR_STOP 0
insert into auth.users values ('11111111-1111-1111-1111-111111111111','a@x.com'),('22222222-2222-2222-2222-222222222222','b@x.com');
select 'perfis criados', count(*) from perfis;
grant all on all tables in schema public to service_role;
-- médico A
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into locais (id,nome,valor,prazo,forma) values ('l1','Hosp A',1500,30,'PJ');
insert into plantoes (id,local_id,data,venc,turno,valor) values ('p1','l1','2026-10-01','2026-10-31','12h',1500);
update perfis set nome='Dr A' where id=auth.uid();
select 'A muda status (deve falhar)'; update perfis set status='ativa' where id=auth.uid();
-- médico B
reset role; set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'B ve locais de A (deve ser 0)', count(*) from locais; select 'B ve plantoes de A (0)', count(*) from plantoes;
select 'B apaga de A (0 linhas)'; delete from plantoes where id='p1';
reset role;
select 'p1 ainda existe', count(*) from plantoes;
-- A com teste vencido
update perfis set teste_ate = current_date - 1 where id='11111111-1111-1111-1111-111111111111';
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'A pausado ve dados', count(*) from plantoes;
select 'A pausado lança (deve falhar)'; insert into plantoes (id,local_id,data,venc,turno,valor) values ('p2','l1','2026-10-02','2026-11-01','12h',1500);
select 'A pausado edita (deve falhar)'; update plantoes set valor=1 where id='p1';
select 'A pausado apaga (pode)'; delete from plantoes where id='p1';
reset role;
update perfis set pago_ate = current_date + 10, status='ativa' where id='11111111-1111-1111-1111-111111111111';
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'A pago lança (pode)'; insert into plantoes (id,local_id,data,venc,turno,valor) values ('p3','l1','2026-10-02','2026-11-01','12h',1500);
select 'anon webhook (deve falhar)'; reset role; set role anon; select count(*) from webhook_eventos;
reset role; delete from auth.users where id='11111111-1111-1111-1111-111111111111'; select 'cascata', (select count(*) from perfis), (select count(*) from locais), (select count(*) from plantoes);
