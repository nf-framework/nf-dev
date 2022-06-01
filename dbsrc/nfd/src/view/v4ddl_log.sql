create or replace view nfd.v4ddl_log as 
 SELECT main.id,
    main.schema_name,
    main.object_type,
    main.object_identity,
    main.object_name,
    main.ddl_text,
    main.ddl_tag,
    main.ddl_tag_type,
    main.ddl_execute_ts
   FROM nfd.ddl_log main;