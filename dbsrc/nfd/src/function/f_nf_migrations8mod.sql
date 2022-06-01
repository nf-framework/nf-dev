CREATE OR REPLACE FUNCTION nfd.f_nf_migrations8mod(p_filename character varying)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
insert into public.nf_migrations (filename) 
values (p_filename)
on conflict (filename) 
do nothing
$function$
;
comment on function nfd.f_nf_migrations8mod(p_filename character varying) is 'Выставление посчитанного хеша объекта в инструменте миграции базы данных';