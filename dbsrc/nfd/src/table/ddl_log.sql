{
    "schema": "nfd",
    "tablename": "ddl_log",
    "comment": "Лог изменений объектов БД",
    "cols": [
        {
            "name": "ddl_execute_ts",
            "datatype": "timestamp",
            "datatype_length": null,
            "datatype_full": "timestamp without time zone",
            "required": true,
            "default_value": null,
            "comment": "Дата выполнения",
            "fk_tablename": null,
            "column_id": 7
        },
        {
            "name": "ddl_tag",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": false,
            "default_value": null,
            "comment": "Тип выполненного действия",
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "ddl_tag_type",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": false,
            "default_value": null,
            "comment": "Сокращенный тип выполнимого действия",
            "fk_tablename": null,
            "column_id": 10
        },
        {
            "name": "ddl_text",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": false,
            "default_value": null,
            "comment": "Текст выполненного действия",
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('nfd.s4ddl_log'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "object_identity",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": false,
            "default_value": null,
            "comment": "Полное имя объекта,подобъекта",
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "object_name",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": false,
            "default_value": null,
            "comment": "Имя отслеживаемого объекта",
            "fk_tablename": null,
            "column_id": 9
        },
        {
            "name": "object_type",
            "datatype": "varchar",
            "datatype_length": "64",
            "datatype_full": "character varying(64)",
            "required": true,
            "default_value": null,
            "comment": "Тип объекта",
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "schema_name",
            "datatype": "varchar",
            "datatype_length": "64",
            "datatype_full": "character varying(64)",
            "required": false,
            "default_value": null,
            "comment": "Схема объекта",
            "fk_tablename": null,
            "column_id": 2
        },
        {
            "name": "sesinfo",
            "datatype": "jsonb",
            "datatype_length": null,
            "datatype_full": "jsonb",
            "required": false,
            "default_value": null,
            "comment": "Информация о сессии, выполнившей команду",
            "fk_tablename": null,
            "column_id": 8
        }
    ],
    "cons": [
        {
            "name": "pk4ddl_log",
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