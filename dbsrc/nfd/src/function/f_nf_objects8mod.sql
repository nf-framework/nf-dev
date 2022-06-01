CREATE OR REPLACE FUNCTION nfd.f_nf_objects8mod(p_obj_type character varying, p_obj_schema character varying, p_obj_name character varying, p_hash character varying)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
insert into public.nf_objects (obj_type, obj_schema, obj_name, hash) 
values (p_obj_type, p_obj_schema, p_obj_name, p_hash)
on conflict (obj_type, obj_schema, obj_name) 
do update set hash = p_hash
$function$
;
comment on function nfd.f_nf_objects8mod(p_obj_type character varying, p_obj_schema character varying, p_obj_name character varying, p_hash character varying) is 'Выставление посчитанного хеша объекта в инструменте миграции базы данных';