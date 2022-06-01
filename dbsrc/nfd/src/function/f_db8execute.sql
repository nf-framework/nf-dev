CREATE OR REPLACE FUNCTION nfd.f_db8execute(p_sql text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  execute p_sql;
end;
$function$
;