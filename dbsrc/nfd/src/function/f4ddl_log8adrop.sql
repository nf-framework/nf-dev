CREATE OR REPLACE FUNCTION nfd.f4ddl_log8adrop()
 RETURNS event_trigger
 LANGUAGE plpgsql
 STRICT
AS $function$
declare 
    obj record;
begin
    for obj in select * from pg_event_trigger_dropped_objects() where original
    loop  
        insert into nfd.ddl_log 
        (
            schema_name,
            object_type,
            object_identity,
            object_name,
            ddl_text,
            ddl_tag,
            ddl_tag_type,
            ddl_execute_ts,
            sesinfo
        ) values (
            lower(obj.schema_name),
            lower(obj.object_type),
            lower(obj.object_identity),
            (case lower(obj.object_type) 
                 when 'function' then split_part(lower(obj.object_identity),'(',1)
                 when 'view' then lower(obj.object_identity)
                 when 'index' then (select i.indrelid::regclass::text
                                      from pg_catalog.pg_index i where i.indexrelid = obj.objid)
                 else lower(obj.object_name)
             end),
            current_query(),
            tg_tag,
            'drop',
            clock_timestamp(),
            null --coalesce(core.f_sys_get_config('remote_ip')::varchar,(pg_catalog.inet_client_addr())::varchar)
        ); 
    end loop;
end;
$function$
;