import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";
import { cloneDeep } from "@nfjs/core/api/common";

export default class DevDbSourceSave extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Подготовка исходников бд' },
            objectTypes: {
                type: Array,
                value: () => [
                    { value: "table" },
                    { value: "view" },
                    { value: "function" },
                    { value: "trigger" },
                    { value: "sequence" },
                ]
            },
            blockEvents: {
                type: Array,
                value: () => [
                    { value: "run", text: "run - Запуск применения изменений в объектах(самый старт)" },
                    { value: "safedrop", text: "safedrop - Удаления объектов которые поменяются в обновлении (представления, функции, триггеры)" },
                    { value: "main", text: "main - Основные изменения в таблицах. Создание, создание и изменения колонок" },
                    { value: "func", text: "func - Создание функций" },
                    { value: "trig", text: "trig - Создание триггеров" },
                    { value: "view", text: "view - Создание представлений" },
                    { value: "pkey", text: "pkey - Создание первичных, уникальных ключей на таблицы" },
                    { value: "end", text: "end - Все оставшееся по объектам" },
                    { value: "dats", text: "dats - Обработка данных из dats папок" }
                ]
            },
            blockWhens: {
                type: Array,
                value: () => [
                    { value: 'before', text: 'before - До (только для run)' },
                    { value: 'after', text: 'after - После' }
                ]
            },
            newDatsSchema: {
                type: Object,
                value: () => ({
                    columns: [],
                    ukColumns: []
                })
            },
            newMigration: { type: Object, value: () => ({}) },
            newSchema: { type: Object, value: () => ({ useUnits: false }) },
            initParams: {},
            activeMigration: {},
            activeDats: {},
            activeDdlLog: {},
            objs: { value: () => ([]) },
            dats: { value: () => ([]) },
            schemas: { value: () => ([]) },
            migrations: { value: () => ([]) },
            ddl_log: { value: () => ([]) },
            tabl: { value: () => ([]) },
            tablCols: { value: () => ([]) },
            extensions: { value: () => ([]) },
            newMigrationInvalid: {},
            newDatsSchemaInvalid: {}
        }
    }

    static get css() {
        return css`
            pl-grid {
                --pl-grid-cell-min-height: 24px;
            }
            
            .col {
                width: 120px;
            }
        `;
    }

    static get template() {
        return html`
            <pl-flex-layout fit vertical>
                <pl-checkbox caption="Отмечать в провайдере (default), что сохраняемые элементы уже выполнены. Работает только при наличии схемы nfd в провайдере данных." checked="{{initParams.markApplied}}" hidden="[[!initParams.using_nfd]]"></pl-checkbox>
                <pl-tabpanel fit>
                    <pl-tab header="Объекты" fit>
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout>
                                <pl-button label="Сохранить выделенные в исходники" variant="primary" on-click="[[saveObjs]]"></pl-button>
                                <pl-button label="Подготовить схему в исходниках" on-click="[[newSchemaOpen]]"></pl-button>
                            </pl-flex-layout>
                            <pl-flex-layout fit>
                                <pl-grid data="{{objs}}" partial-data>
                                    <pl-grid-column width="48">
                                        <template>
                                            <pl-flex-layout fit justify="center">
                                                <pl-checkbox checked="{{row.selected}}" variant="horizontal"></pl-checkbox>
                                            </pl-flex-layout>
                                        </template>    
                                    </pl-grid-column>
                                    <pl-grid-column header="Схема объекта" field="object_schema" resizable sortable></pl-grid-column>
                                    <pl-grid-column header="Наименование объекта" field="object_name" resizable sortable></pl-grid-column>
                                    <pl-grid-column header="Тип объекта" field="object_type" resizable sortable></pl-grid-column>
                                    <pl-grid-column header="Дата последнего изменения" field="ddl_execute_ts" sortable sort="desc" format="DD.MM.YYYY HH:mm:ss" width="120"></pl-grid-column>
                                    <pl-flex-layout slot="top-toolbar" align="flex-end">
                                        <pl-icon-button iconset="pl-default" icon="repeat" on-click="[[doRefreshObj]]"></pl-icon-button>
                                        <pl-filter-container id="fcObjs" data="{{objs}}">
                                            <pl-filter-item field="object_name" operator="like_both">
                                                <pl-input label="name"></pl-input>
                                            </pl-filter-item>
                                            <pl-filter-item field="object_schema" operator="=">
                                                <pl-combobox label="schema" data="[[schemas]]" value-property="code" text-property="code"></pl-combobox>
                                            </pl-filter-item>
                                            <pl-filter-item field="object_type" operator="=">
                                                <pl-combobox label="type" data="[[objectTypes]]" text-property="value"></pl-combobox>
                                            </pl-filter-item>
                                        </pl-filter-container>
                                        <pl-checkbox label="Ограничить по текущему пользователю" checked="{{initParams.limitObjectsByOwner}}"></pl-checkbox>
                                        <pl-checkbox label="Ограничить по подключенным модулям" checked="{{initParams.limitSchemasByApp}}"></pl-checkbox>
                                    </pl-flex-layout>
                                </pl-grid>
                            </pl-flex-layout>
                        </pl-flex-layout>
                    </pl-tab>
                    <pl-tab header="Данные таблиц">
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout>
                                <pl-icon-button iconset="pl-default" icon="repeat" on-click="[[doRefreshDats]]"></pl-icon-button>
                                <pl-button label="Сохранить выделенные в исходники" variant="primary" on-click="[[saveDats]]"></pl-button>
                                <pl-button label="+Схема" on-click="[[newDatsSchemaOpen]]"></pl-button>
                            </pl-flex-layout>
                            <pl-flex-layout fit>
                                <pl-grid data="{{dats}}" key-field="table" pkey-field="schema" selected="{{activeDats}}" tree>
                                    <pl-grid-column width="80">
                                        <template>
                                            <pl-checkbox checked="{{row.selected}}" variant="horizontal" hidden="[[!row.schema]]"></pl-checkbox>
                                        </template>
                                    </pl-grid-column>
                                    <pl-grid-column header="Схемы выгрузки данных" field="table"></pl-grid-column>
                                </pl-grid>
                            </pl-flex-layout>
                        </pl-flex-layout>
                    </pl-tab>
                    <pl-tab header="Миграции">
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout>
                                <pl-button label="Сохранить в исходники" on-click="[[saveMigs]]" variant="primary"></pl-button>
                                <pl-button label="+ Миграция" on-click="[[newMigrationOpen]]"></pl-button>
                            </pl-flex-layout>
                            <pl-flex-layout fit>
                                <pl-flex-layout fit>
                                    <pl-grid selected="{{activeMigration}}" data="[[migrations]]">
                                        <pl-grid-column header="Имя" width="350" field="name" resizable></pl-grid-column>
                                        <pl-grid-column header="Схема" field="schema" resizable></pl-grid-column>
                                        <pl-grid-column action width="48">
                                            <template>
                                                <pl-icon-button iconset="pl-default" icon="trashcan" on-click="[[deleteMigration]]"></pl-icon-button>
                                            </template>
                                        </pl-grid-column>
                                    </pl-grid>
                                </pl-flex-layout>
                                <pl-flex-layout fit>
                                    <pl-codeeditor value="{{activeMigration.script}}" mode="ace/mode/sql"></pl-codeeditor>
                                </pl-flex-layout>
                            </pl-flex-layout>
                        </pl-flex-layout>
                    </pl-tab>
                    <pl-tab header="Лог действий" hidden="[[!initParams.using_nfd]]">
                        <pl-flex-layout fit>
                            <pl-flex-layout fit>
                                <pl-grid data="{{ddl_log}}" selected="{{activeDdlLog}}" partial-data>
                                    <pl-flex-layout slot="top-toolbar" align="flex-end">
                                        <pl-icon-button iconset="pl-default" icon="repeat" on-click="[[doRefreshLogs]]"></pl-icon-button>
                                        <pl-filter-container id="fcDdlLog" data="{{ddl_log}}">
                                            <pl-filter-item field="schema_name">
                                                <pl-input label="Схема"></pl-input>
                                            </pl-filter-item>
                                            <pl-filter-item field="object_type">
                                                <pl-input label="Тип объекта"></pl-input>
                                            </pl-filter-item>
                                        </pl-filter-container>
                                    </pl-flex-layout>
                                    <pl-grid-column header="id" field="id" resizable sortable sort="desc" width="60"></pl-grid-column>
                                    <pl-grid-column header="Итоговый объект" field="object_name"></pl-grid-column>
                                    <pl-grid-column header="Схема" field="schema_name"></pl-grid-column>
                                    <pl-grid-column header="Объект" field="object_identity"></pl-grid-column>
                                    <pl-grid-column header="Тип объекта" field="object_type"></pl-grid-column>
                                    <pl-grid-column header="Действие" field="ddl_tag"></pl-grid-column>
                                    <pl-grid-column header="Тип действия" field="ddl_tag_type"></pl-grid-column>
                                    <pl-grid-column header="Дата выполнения" field="ddl_execute_ts" format="DD.MM.YYYY HH:mm:ss"></pl-grid-column>
                                </pl-grid>
                            </pl-flex-layout>
                            <pl-flex-layout fit>
                                <pl-textarea fit value="[[activeDdlLog.ddl_text]]"></pl-textarea>
                            </pl-flex-layout>
                        </pl-flex-layout>
                    </pl-tab>
                </pl-tabpanel>
            </pl-flex-layout>
            <pl-dropdown id="ddNewDatsSchema">
                <pl-flex-layout vertical>
                    <pl-combobox label="Схема" value="{{newDatsSchema.schema}}" data="[[schemas]]" value-property="code" text-property="code" required></pl-combobox>
                    <pl-combobox label="Таблица" value="{{newDatsSchema.table}}" data="[[tabl]]" value-property="code" text-property="code" required></pl-combobox>
                    <span>Выгружаемые колонки</span>
                    <pl-flex-layout>
                        <pl-icon-button iconset="pl-default" icon="plus-s" on-click="[[newDatsSchemaColumnsAdd]]"></pl-icon-button>
                        <pl-repeat items="{{newDatsSchema.columns}}" as="col">
                            <template>
                                <pl-flex-layout>
                                    <pl-combobox value="{{col.name}}" data="[[tablCols]]" class="col" value-property="code" text-property="code"></pl-combobox>
                                    <pl-icon-button iconset="pl-default" icon="close-s" on-click="[[newDatsSchemaColumnsDel]]"></pl-icon-button>
                                </pl-flex-layout>
                            </template>
                        </pl-repeat>
                    </pl-flex-layout>
                    <span>Колонки образующие уникальный ключ</span>
                    <pl-flex-layout>
                        <pl-icon-button iconset="pl-default" icon="plus-s" on-click="[[newDatsSchemaUkColumnsAdd]]"></pl-icon-button>
                        <pl-repeat items="{{newDatsSchema.ukColumns}}" as="col">
                            <template>
                                <pl-flex-layout>
                                    <pl-combobox value="{{col.name}}" data="[[tablCols]]" class="col" value-property="code" text-property="code"></pl-combobox>
                                    <pl-icon-button iconset="pl-default" icon="close-s" on-click="[[newDatsSchemaUkColumnsDel]]"></pl-icon-button>
                                </pl-flex-layout>
                            </template>
                        </pl-repeat>
                    </pl-flex-layout>
                    <pl-valid-observer invalid="{{newDatsSchemaInvalid}}"></pl-valid-observer>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-button label="Создать" disabled="[[newDatsSchemaInvalid]]" on-click="[[newDatsSchemaSave]]" variant="primary">
                        <pl-icon iconset="pl-default" icon="save" slot="suffix"></pl-icon>
                    </pl-button>
                    <pl-button label="Отмена" on-click="[[newDatsSchemaCancel]]" variant="secondary">
                        <pl-icon iconset="pl-default" icon="close-s" slot="suffix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
            </pl-dropdown>
            <pl-dropdown id="ddNewSchema">
                <pl-flex-layout vertical>
                    <pl-input label="Схема" value="{{newSchema.schema}}" required></pl-input>
                    <pl-combobox label="Модуль приложения" value="{{newSchema.mdl}}" data="[[initParams.extensions]]" value-property="name" text-property="name" required></pl-combobox>
                    <pl-checkbox label="Будет выгрузка разделов?" checked="{{newSchema.useUnits}}"></pl-checkbox>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-button label="Подготовить" on-click="[[newSchemaPrepare]]" variant="primary">
                        <pl-icon iconset="pl-default" icon="save" slot="suffix"></pl-icon>
                    </pl-button>
                    <pl-button label="Отмена" on-click="[[newSchemaCancel]]" variant="secondary">
                        <pl-icon iconset="pl-default" icon="close-s" slot="suffix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
            </pl-dropdown>
            <pl-dropdown id="ddNewMigration">
                <pl-flex-layout vertical>
                    <pl-combobox label="Схема" value="{{newMigration.schema}}" variant="horizontal" data="[[schemas]]" value-property="code" text-property="code" required></pl-combobox>
                    <pl-input label="Комментарий" value="{{newMigration.comment}}" variant="horizontal"></pl-input>
                    <pl-combobox label="Блок: Событие" value="{{newMigration.blockEvent}}" data="[[blockEvents]]" variant="horizontal"></pl-combobox>
                    <pl-combobox label="Блок: Время срабатывания" value="{{newMigration.blockWhen}}" data="[[blockWhens]]" variant="horizontal"></pl-combobox>
                    <pl-valid-observer invalid="{{newMigrationInvalid}}"></pl-valid-observer>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-button label="Добавить" on-click="[[newMigrationAdd]]" variant="primary" disabled="[[newMigrationInvalid]]"></pl-button>
                    <pl-button label="Отмена" on-click="[[newMigrationCancel]]"></pl-button>
                </pl-flex-layout>
            </pl-dropdown>
            <pl-dataset id="dsSchemas" data="{{schemas}}" endpoint="/@nfjs/front-pl/fse/dev.db-source-save/dataset/dsSchemas" args="[[_compose('limitByOwner;schemas;limitByApp',initParams.limitObjectsByOwner,initParams.schemas,initParams.limitSchemasByApp)]]" required-args="limitByOwner;schemas;limitByApp" execute-on-args-change></pl-dataset>
            <pl-dataset id="dsTabl" data="{{tabl}}" endpoint="/@nfjs/front-pl/fse/dev.db-source-save/dataset/dsTabl" args="[[_compose('schema',newDatsSchema.schema)]]" required-args="schema" execute-on-args-change></pl-dataset>
            <pl-dataset id="dsTablCols" data="{{tablCols}}" endpoint="/@nfjs/front-pl/fse/dev.db-source-save/dataset/dsTablCols" args="[[_compose('schema;table',newDatsSchema.schema,newDatsSchema.table)]]" required-args="schema;table" execute-on-args-change></pl-dataset>
            <pl-dataset id="dsObjs" data="{{objs}}" endpoint="/@nfjs/front-pl/fse/dev.db-source-save/dataset/dsObjs" args="[[_compose('using_nfd;limitByOwner',initParams.using_nfd,initParams.limitObjectsByOwner)]]"></pl-dataset>
            <pl-dataset id="dsDats" endpoint="/@nfjs/dev/api/db-source-save/getDats"></pl-dataset>
            <pl-dataset id="dsDdlLog" data="{{ddl_log}}" endpoint="/@nfjs/front-pl/fse/dev.db-source-save/dataset/dsDdlLog"></pl-dataset>
            <pl-action id="aGetOptions" data="{{initParams}}" endpoint="/@nfjs/dev/api/db-source-save/getOptions"></pl-action>
            <pl-action id="aSaveObjs" endpoint="/@nfjs/dev/api/db-source-save/saveObjs"></pl-action>
            <pl-action id="aSaveDats" endpoint="/@nfjs/dev/api/db-source-save/saveDats"></pl-action>
            <pl-action id="aSaveMigs" endpoint="/@nfjs/dev/api/db-source-save/saveMigrations"></pl-action>
            <pl-action id="aAddDatsSchema" endpoint="/@nfjs/dev/api/db-source-save/generateDefaultDats"></pl-action>
            <pl-action id="aGetMigrationName" endpoint="/@nfjs/dev/api/db-source-save/getMigrationName"></pl-action>
            <pl-action id="aPrepareSchemaInModule" endpoint="/@nfjs/dev/api/db-source-save/prepareSchemaInModule"></pl-action>
		`;
    }

    async onConnect() {
        await this.$.aGetOptions.execute();
        setTimeout( () => {
            this.doRefreshObj();
            this.doRefreshDats();
            if (this.initParams.using_nfd) this.doRefreshLogs();
        }, 0);
    }

    doRefreshObj() {
        this.$.fcObjs.applyFilters();
        this.$.dsObjs.execute();
    }

    async saveObjs() {
        const args = {
            objs: this.objs.filter(o => o.selected === true),
            markApplied: this.initParams.markApplied
        }
        const res = await this.$.aSaveObjs.execute(args);
        this.notify(res.message, { type: res.messageType});
    }

    async doRefreshDats() {
        const dats = await this.$.dsDats.execute();
        dats.forEach(d => { d.selected = false; });
        this.dats = dats;
    }

    newDatsSchemaOpen(event) {
        this.$.ddNewDatsSchema.open(event.target);
    }

    async newDatsSchemaSave() {
        const args = cloneDeep(this.newDatsSchema);
        args.columns = args.columns.map(c => c.name);
        args.ukColumns = args.ukColumns.map(c => c.name);
        await this.$.aAddDatsSchema.execute(args);
        this.$.ddNewDatsSchema.close();
        this.doRefreshDats();
    }

    newDatsSchemaCancel() {
        this.$.ddNewDatsSchema.close();
    }

    newDatsSchemaColumnsAdd() {
        this.push('newDatsSchema.columns', {});
    }
    newDatsSchemaColumnsDel(event) {
        const idx = this.newDatsSchema.columns.findIndex(i => i === event.model.col);
        this.splice('newDatsSchema.columns', idx, 1);
    }
    newDatsSchemaUkColumnsAdd() {
        this.push('newDatsSchema.ukColumns', {});
    }
    newDatsSchemaUkColumnsDel(event) {
        const idx = this.newDatsSchema.ukColumns.findIndex(i => i === event.model.col);
        this.splice('newDatsSchema.ukColumns', idx, 1);
    }
    async saveDats() {
        const args = {
            dats: this.dats.filter(o => o.selected === true),
            markApplied: this.initParams.markApplied
        }
        const res = await this.$.aSaveDats.execute(args);
        this.notify(res.message, { type: res.messageType});
    }

    newMigrationOpen(event) {
        this.$.ddNewMigration.open(event.target);
    }

    async newMigrationAdd() {
        const migrationName = await this.$.aGetMigrationName.execute({
            schema: this.newMigration.schema,
            count: 0,
            comment: this.newMigration.comment
        });
        const nM = Object.assign({}, this.newMigration);
        nM.name = migrationName;
        if (this.newMigration.blockEvent && this.newMigration.blockWhen)
            nM.script = `--[block]{"event":"${this.newMigration.blockEvent}","when":"${this.newMigration.blockWhen}"}`;
        this.push('migrations', nM);
        this.set('activeMigration', nM);
        this.$.ddNewMigration.close();
    }

    newMigrationCancel() {
        this.$.ddNewMigration.close();
    }

    async saveMigs() {
        const res = await this.$.aSaveMigs.execute({
            migrations: this.migrations,
            markApplied: this.initParams.markApplied
        });
        this.notify(res.message, { type: res.messageType });
    }

    deleteMigration(event) {
        this.splice('migrations', this.migrations.indexOf(event.model.row), 1);
    }

    doRefreshLogs() {
        this.$.fcDdlLog.applyFilters();
        this.$.dsDdlLog.execute();
    }

    newSchemaOpen(event) {
        this.$.ddNewSchema.open(event.target);
    }

    async newSchemaPrepare() {
        await this.$.aPrepareSchemaInModule.execute(this.newSchema);
        this.notify('Схема подготовлена. Перезапустите приложение для возможности сохранять объекты в эту схему.');
        this.$.ddNewSchema.close();
    }

    newSchemaCancel() {
        this.$.ddNewSchema.close();
    }

    serverEndpoints = {
        dataset: {
            dsSchemas: {
                text: `select k.schema_name as code
                         from information_schema.schemata k
                        where true
                       {{#if limitByOwner}}
                          and k.schema_owner = session_user
                       {{/if}}
                       {{#if limitByApp}}
                         and k.schema_name = any(string_to_array(:schemas,','))
                       {{/if}}
                       order by 1`
            },
            dsTabl: {
                text: `select p.relname as code
                         from pg_catalog.pg_class p
                              join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace
                        where pn.nspname = :schema
                          and p.relkind  = 'r'
                        order by 1 asc`
            },
            dsTablCols: {
                text: `select t3.attname as code
                         from pg_catalog.pg_attribute t3
                              join pg_catalog.pg_class p on p.oid = t3.attrelid
                              join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace
                        where p.relname = :table
                          and p.relkind  = 'r'
                          and pn.nspname = :schema
                          and t3.attnum > 0
                          and not t3.attisdropped
                        order by t3.attnum asc`
            },
            dsObjs: {
                text: `with obj as (
                        select case t.table_type when 'VIEW' then 'view' when 'BASE TABLE' then 'table' else null end as object_type,
                               t.table_schema as object_schema,
                               t.table_name as object_name
                          from information_schema.tables t
                        union all
                        select case r.routine_type when 'FUNCTION' then 'function' else null end as object_type,
                               r.routine_schema as object_schema,
                               r.routine_name as object_name
                          from information_schema.routines r
                        union all
                        select 'trigger' as object_type,
                               pn.nspname as object_schema,
                               tr.tgname as object_name
                          from pg_catalog.pg_class p
                               join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace
                               join  pg_catalog.pg_trigger tr on tr.tgrelid = p.oid
                         where not tr.tgisinternal
                        union all
                        select 'sequence' as object_type,
                               s.sequence_schema as object_schema,
                               s.sequence_name as object_name
                          from information_schema.sequences s)
                        select obj.*,
                               false as selected,
                               {{#if using_nfd}}dlog.ddl_execute_ts{{else}}null as ddl_execute_ts{{/if}}
                          from obj
                               join information_schema.schemata k on (k.schema_name = obj.object_schema)
                               {{#if using_nfd}}
                               left join lateral (select dl.ddl_execute_ts
                                                    from nfd.v4ddl_log dl
                                                   where dl.schema_name = obj.object_schema
                                                     and dl.object_name = obj.object_schema||'.'||obj.object_name
                                                   order by dl.id desc
                                                   limit 1) dlog on true
                               {{/if}}
                         {{#if limitByOwner}}
                         where (k.schema_owner = session_user or (k.schema_name = 'public' and obj.object_name like 'nf%'))
                         {{/if}}`
            },
            dsDdlLog: {
                text: `select k.id,
                              k.schema_name,
                              k.object_type,
                              k.object_identity,
                              k.object_name,
                              k.ddl_text,
                              k.ddl_tag,
                              k.ddl_tag_type,
                              k.ddl_execute_ts
                         from nfd.v4ddl_log k
                        where k.ddl_tag not in ('GRANT')`
            }
        },
        action: {
            aUnitDel: {
                "@main": {
                    action: 'nfc.f4unitlist8del',
                    type: "func"
                }
            },
        }
    }//serverEndpoints
}