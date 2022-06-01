CREATE OR REPLACE FUNCTION nfd.f4ddl_log8disable()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  -- выполнять из под суперпользователя только можно
  execute 'DROP EVENT TRIGGER IF EXISTS tr_ddl_log_addl;'; 
  execute 'DROP EVENT TRIGGER IF EXISTS tr_ddl_log_adrop;';
end;
$function$
;