CREATE OR REPLACE FUNCTION nfd.f4ddl_log8enable()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  -- выполнять из под суперпользователя только можно
  execute 'CREATE EVENT TRIGGER tr_ddl_log_addl ON ddl_command_end EXECUTE PROCEDURE nfd.f4ddl_log8addl();';
  execute 'CREATE EVENT TRIGGER tr_ddl_log_adrop ON sql_drop EXECUTE PROCEDURE nfd.f4ddl_log8adrop();';
end;
$function$
;