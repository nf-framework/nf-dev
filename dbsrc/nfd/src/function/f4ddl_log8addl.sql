CREATE OR REPLACE FUNCTION nfd.f4ddl_log8addl()
 RETURNS event_trigger
 LANGUAGE plpgsql
 STRICT
AS $function$
declare 
    obj record;
    v_schema_name text;
    v_object_name text;
    v_object_identity text;
begin
for obj in select * from pg_event_trigger_ddl_commands()
loop  
    v_schema_name = lower(obj.schema_name);
    v_object_identity = lower(obj.object_identity);
    if lower(obj.object_type) = 'function' then 
        v_object_name = obj.objid::regproc::text;
    elsif lower(obj.object_type) = 'index' then 
        v_object_name = (select i.indrelid::regclass::text from pg_catalog.pg_index i where i.indexrelid = obj.objid);
    elsif lower(obj.object_type) = 'trigger' then 
        select pn.nspname,
               pn.nspname||'.'||pt.tgname,
               pn.nspname||'.'||p.relname||'.'||pt.tgname
          into v_schema_name,
               v_object_name,
               v_object_identity
          from pg_catalog.pg_trigger pt
               join pg_catalog.pg_class p on p.oid = pt.tgrelid
               join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace 
         where pt.oid = obj.objid;    
    else 
        v_object_name = obj.objid::regclass::text;
    end if;
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
        v_schema_name,
        lower(obj.object_type),
        v_object_identity,
        v_object_name,       
        current_query(),
        tg_tag,
        (case when lower(tg_tag) like 'create %' then 'create'
              when lower(tg_tag) like 'alter %' or lower(tg_tag) like 'comment %' or lower(tg_tag) = 'comment' then 'alter'
        else lower(tg_tag)
        end), 
        clock_timestamp(),
        null--coalesce(core.f_sys_get_config('remote_ip')::varchar,(pg_catalog.inet_client_addr())::varchar)
     );
end loop;
end;
$function$
;