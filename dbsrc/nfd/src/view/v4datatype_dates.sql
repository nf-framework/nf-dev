create or replace view nfd.v4datatype_dates as 
 SELECT main.id,
    main.dt_date,
    main.dt_timestamp,
    main.dt_timestamptz,
    main.dt_time,
    main.dt_timetz
   FROM nfd.datatype_dates main;