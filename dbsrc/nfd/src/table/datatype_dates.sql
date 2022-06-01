{
    "schema": "nfd",
    "tablename": "datatype_dates",
    "comment": "Проверка полей типов данных - дата",
    "cols": [
        {
            "name": "dt_date",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": false,
            "default_value": null,
            "comment": "date",
            "fk_tablename": null,
            "column_id": 2
        },
        {
            "name": "dt_time",
            "datatype": "time",
            "datatype_length": null,
            "datatype_full": "time without time zone",
            "required": false,
            "default_value": null,
            "comment": "time",
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "dt_timestamp",
            "datatype": "timestamp",
            "datatype_length": null,
            "datatype_full": "timestamp without time zone",
            "required": false,
            "default_value": null,
            "comment": "timestamp",
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "dt_timestamptz",
            "datatype": "timestamptz",
            "datatype_length": null,
            "datatype_full": "timestamp with time zone",
            "required": false,
            "default_value": null,
            "comment": "timestamptz",
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "dt_timetz",
            "datatype": "timetz",
            "datatype_length": null,
            "datatype_full": "time with time zone",
            "required": false,
            "default_value": null,
            "comment": "timetz",
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('nfc.s_main'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        }
    ],
    "cons": [
        {
            "name": "pk4datatype_dates",
            "schema": "nfd",
            "type": "p",
            "update_rule": null,
            "delete_rule": null,
            "condition": null,
            "definition": "PRIMARY KEY (id)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "id",
            "comment": null,
            "deferrable": null
        }
    ],
    "indx": null
}