import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";
import { cloneDeep, clearObj } from "@nfjs/core/api/common";

export default class DevUnitEdit extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Настройка раздела' },
            divides: {
                type: Array,
                value: () => [
                    { value: 'sys', text: 'sys' },
                    { value: 'org', text: 'org' },
                    { value: 'grp', text: 'grp' }
                ]
            },
            unit: {
                type: Object,
                value: () => ({
                    $action: null,
                    code: null,
                    pcode: null,
                    caption: null,
                    mdl: null,
                    schema: null,
                    tablename: null,
                    opt: {
                        idGenMethod: 'self',
                        divideType: 'sys',
                        useHierarchy: false
                    },
                    bps:[]
                })
            },
            idGenMethods: {
                type: Array,
                value: () => [
                    { value: 'main', text: 'Основная последовательность' },
                    { value: 'self', text: 'Собственная последовательность' },
                    { value: 'ext', text: 'Без автоматической генерации' }
                ]
            },
            invalid: {},
            hasChanges: { value: false },
            modulelist: { type: Array, value: () => [] },
            unitlist: { type: Array, value: () => [] },
            objects: { type: Array, value: () => [] },
        }
    }

    static get css() {
        return css`
            pl-grid {
                --pl-grid-cell-min-height: 24px;
            }
            
            .objects {
                height: 100%;
                width: 600px;
            }
        `;
    }

    static get template() {
        return html`
            <pl-flex-layout fit>
                <pl-flex-layout fit vertical>
                    <pl-flex-layout >
                        <pl-button label="Сохранить" on-click="[[onSave]]" disabled="[[disableSave(hasChanges,invalid)]]" variant="primary">
                            <pl-icon iconset="pl-default" icon="save" slot="suffix"></pl-icon>
                        </pl-button>
                        <pl-button label="Отменить" on-click="[[close]]">
                            <pl-icon iconset="pl-default" icon="close-s" slot="suffix"></pl-icon>
                        </pl-button>
                    </pl-flex-layout>
                    <pl-flex-layout>
                        <pl-flex-layout vertical>
                            <pl-combobox label="Модуль" value="{{unit.mdl}}" data="[[modulelist]]" text-property="code" value-property="code" required></pl-combobox>
                            <pl-input label="Код" value="{{unit.code}}" required disabled="[[isCreated(unit.$action)]]" pattern="^\w+\.\w+$"></pl-input>
                            <pl-input label="Наименование" value="{{unit.caption}}" required></pl-input>
                            <pl-combobox label="Родительский" value="{{unit.pcode}}" data="[[unitlist]]" text-property="code" value-property="code"></pl-combobox>
                        </pl-flex-layout>
                        <pl-flex-layout vertical>
                            <pl-combobox label="Генерация идентификатора" text-property="text" value-property="value" value="{{unit.opt.idGenMethod}}" data="[[idGenMethods]]" required></pl-combobox>
                            <pl-combobox label="Деление" value="{{unit.opt.divideType}}" text-property="text" value-property="value"  data="[[divides]]" required></pl-combobox>
                            <pl-checkbox label="Иерархия" checked="{{unit.opt.useHierarchy}}" required></pl-checkbox>
                        </pl-flex-layout>
                    </pl-flex-layout>
                    <pl-card header="Действия" fit>
                        <pl-flex-layout slot="header-suffix">
                            <pl-button label="Добавить" on-click="[[onBpAdd]]">
                                <pl-icon iconset="pl-default" icon="plus" slot="prefix"></pl-icon>
                            </pl-button>
                            <pl-button label="Добавить все стандартные" on-click="[[onBpAddStandard]]">
                                <pl-icon iconset="pl-default" icon="plus" slot="prefix"></pl-icon>
                            </pl-button>
                        </pl-flex-layout>
                        <pl-grid data="{{unit.bps}}">
                            <pl-grid-column header="Код">
                                <template>
                                    <pl-input value="{{row.code}}" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Наименование">
                                <template>
                                    <pl-input value="{{row.caption}}" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Выполняемая функция">
                                <template>
                                    <pl-input value="{{row.exec_function}}" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Проверять права?" width="130">
                                <template>
                                    <pl-flex-layout fit justify="center">
                                        <pl-checkbox variant="horizontal" checked="{{row.use_privs}}"></pl-checkbox>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column action width="72">
                                <template>
                                    <style>
                                        pl-flex-layout {
                                            gap: 0px;
                                        }
                                    </style>
                                    <pl-flex-layout>
                                        <pl-icon-button variant="link" size="14" iconset="pl-default" icon="copy" on-click="[[onBpCopy]]"></pl-icon-button>
                                        <pl-icon-button variant="link" size="14" iconset="pl-default" icon="trashcan" on-click="[[onBpDel]]"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-card>
                    <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
                </pl-flex-layout>
                <pl-flex-layout class="objects" hidden="[[!isCreated(unit.$action)]]">
                    <pl-grid data="[[objects]]" key-field="obj_fullname" pkey-field="obj_type" tree>
                        <pl-grid-column field="obj_fullname" header="Наименование"></pl-grid-column>
                        <pl-grid-column action width="100">
                            <template>
                                <style>
                                    pl-flex-layout {
                                        gap: 0px;
                                    }
                                </style>
                                <pl-flex-layout>
                                    <pl-icon-button variant="link" size="14" iconset="pl-default" icon="plus" on-click="[[onObjectAdd]]" hidden="[[row.obj_type]]"></pl-icon-button>
                                    <pl-icon-button variant="link" size="14" iconset="pl-default" icon="pencil" on-click="[[onObjectUpd]]" hidden="[[!row.obj_type]]"></pl-icon-button>
                                    <pl-icon-button variant="link" size="14" iconset="pl-default" icon="copy" on-click="[[onObjectCopy]]" hidden="[[!row.obj_type]]"></pl-icon-button>
                                    <pl-icon-button variant="link" size="14" iconset="pl-default" icon="trashcan" on-click="[[onObjectDel]]" hidden="[[!row.obj_type]]"></pl-icon-button>
                                </pl-flex-layout>
                            </template>
                        </pl-grid-column>    
                    </pl-grid>
                </pl-flex-layout>
            </pl-flex-layout>    
            <pl-data-observer id="doUnit" data="[[unit]]" is-changed="{{hasChanges}}"></pl-data-observer>
            <pl-action id="aGet" endpoint="/@nfjs/front-pl/fse/dev.unit-edit/action/aGet"></pl-action>
            <pl-action id="aSave" endpoint="/@nfjs/front-pl/fse/dev.unit-edit/action/aSave" paths="bps"></pl-action>
            <pl-action id="aDropObject" endpoint="/@nfjs/db-editor/drop"></pl-action>
            <pl-dataset id="dsModulelist" data="{{modulelist}}" endpoint="/@nfjs/front-pl/fse/dev.unit-edit/dataset/dsModulelist"></pl-dataset>
            <pl-dataset id="dsUnitlist" data="{{unitlist}}" endpoint="/@nfjs/front-pl/fse/dev.unit-edit/dataset/dsUnitlist"></pl-dataset>
            <pl-dataset id="dsObjects" data="{{objects}}" endpoint="/@nfjs/front-pl/fse/dev.unit-edit/dataset/dsObjects"></pl-dataset>
		`;
    }

    async onConnect() {
        this.defaultBp = {
            code: null,
            caption: null,
            exec_function: null,
            use_privs: true
        };
        this.defaultAddBp = {
            code: 'add',
            caption: 'Добавление',
            exec_function: null,
            use_privs: true
        };
        this.defaultUpdBp = {
            code: 'upd',
            caption: 'Исправление',
            exec_function: null,
            use_privs: true
        };
        this.defaultDelBp = {
            code: 'del',
            caption: 'Удаление',
            exec_function: null,
            use_privs: true
        };
        await this.$.dsModulelist.execute();
        if (this.code)
        {
            let { unit } = await this.$.aGet.execute({code: this.code});
            unit.opt = unit.opt || {};
            unit.bps = unit.bps || [];
            if (this.action === 'copy') {
                this.$.doUnit.snapshot();
                unit.$action = 'add';
                for (const unitKey in unit) {
                    this.set(`unit.${unitKey}`, unit[unitKey]);
                }
            } else {
                unit.$action = 'upd';
                this.unit = unit;
                this.$.doUnit.reset();
                this.$.doUnit.snapshot();
                this.$.dsObjects.execute({unit: this.unit.code});
            }
        } else {
            this.set('unit.$action', 'add');
            this.$.doUnit.snapshot();
            this.splice('unit.bps', 0, 0, ...[
                {...this.defaultAddBp},
                {...this.defaultUpdBp},
                {...this.defaultDelBp}
            ]);
            this.set('unit.mdl', this.mdl ?? this.modules?.[0]?.code);
            this.set('unit.code', this.unit.mdl + '.');
            this.set('unit.pcode', this.pcode ?? null);
            this.set('unit.caption', this.pcode_caption ?? null);
        }
        this.$.dsUnitlist.execute();
    }

    disableSave(hasChanges, invalid) {
        return !hasChanges || invalid;
    }

    onBpAdd() {
        this.push('unit.bps', {...this.defaultBp});
    }
    onBpAddStandard() {
        if (this.unit.bps.findIndex(bp => bp.code === 'add') === -1)
            this.push('unit.bps', {...this.defaultAddBp});
        if (this.unit.bps.findIndex(bp => bp.code === 'upd') === -1)
            this.push('unit.bps', {...this.defaultUpdBp});
        if (this.unit.bps.findIndex(bp => bp.code === 'del') === -1)
            this.push('unit.bps', {...this.defaultDelBp});
    }
    onBpDel(event) {
        const idx = this.unit.bps.findIndex(i => i === event.model.row);
        if (idx > -1) this.splice('unit.bps', idx, 1);
    }
    onBpCopy(event) {
        this.push('unit.bps', {...event.model.row});
    }

    async onSave() {
        await this.$.aSave.execute(this.unit);
        this.set('unit.$action', 'upd');
        this.$.doUnit.reset();
        this.$.doUnit.snapshot();
        this.$.dsObjects.execute({unit: this.unit.code});
    }

    isCreated(action) {
        return action === 'upd';
    }

    async objOperation(obj, action) {
        await this.open(`db-editor.${obj.obj_type}`, { action, ...clearObj(cloneDeep(obj),['__','_']) });
        this.$.dsObjects.execute({unit: this.unit.code});
    }

    getObjName(prefix='', postfix='', addSchema=false) {
        const {code, mdl} = this.unit;
        const tablename = (!code)?'':(code.includes('.'))?code.split('.')[1]:code;
        return `${(addSchema)?mdl+'.':''}${(prefix)?prefix+'4':''}${tablename}${(postfix)?'8'+postfix:''}`;
    }

    async onObjectAdd(event)
    {
        const obj_type = event.model.row.obj_fullname; // так построено дерево
        const obj = {
            schema: this.unit.code.split('.')[0]
        };
        switch (obj_type) {
            case 'table':
                const addRefColumn = (columnName, comment, ref) => {
                    const indxName = this.getObjName('i', columnName);
                    const consName = this.getObjName('fk', columnName);
                    obj.cols.push({
                        name: columnName,
                        datatype: 'int8',
                        required: true,
                        comment: comment
                    });
                    obj.indx.push({
                        name: indxName,
                        columns: [{name: columnName}]
                    });
                    obj.cons.push(Object.assign({
                        name: consName,
                        type: 'f',
                        columns: columnName
                    }, ref));
                }

                obj.tablename = this.unit.code.split('.')[1];
                obj.comment = this.unit.caption;
                obj.cols = [];
                obj.cons = [];
                obj.indx = [];
                const { idGenMethod, divideType, useHierarchy } = this.unit.opt;
                // настройка генерации первичного ключа
                if ((idGenMethod ?? 'ext') !== 'ext') {
                    const consName = this.getObjName('pk');
                    const con = {
                        name: consName,
                        type: 'p',
                        columns: 'id',
                    };
                    const col = {
                        name: 'id',
                        datatype: 'int8',
                        required: true,
                        default_value: `nextval('${obj.schema}.s4${obj.tablename}'::text::regclass)`,
                    };
                    if (idGenMethod === 'main') {
                        col.default_value = `nextval('nfc.s_main'::text::regclass)`;
                    }
                    obj.cols.push(col);
                    obj.cons.push(con);
                }
                // настройка деления раздела
                if (divideType === 'org') addRefColumn('org', null, {
                    r_schema: 'nfc',
                    r_tablename: 'org',
                    r_columnname: 'id'
                });
                if (divideType === 'grp') addRefColumn('grp', null, {
                    r_schema: 'nfc',
                    r_tablename: 'grp',
                    r_columnname: 'id'
                });
                // иерархия
                if (useHierarchy === true) addRefColumn('hid', 'Иерархия', {
                    r_schema: obj.schema,
                    r_tablename: obj.tablename,
                    r_columnname: 'id'
                });
                // родительский раздел
                if (this.unit.pcode) addRefColumn('pid', 'Родитель', {
                    r_schema: this.unit.pcode.split('.')[0],
                    r_tablename: this.unit.pcode.split('.')[1],
                    r_columnname: 'id'
                });
                break;
            case 'sequence':
                obj.name = 's4' + this.unit.code.split('.')[1];
                break;
            case 'view':
                obj.name = 'v4' + this.unit.code.split('.')[1];
                obj.tablename = this.unit.code.split('.')[1];
                obj.bodyWhere = `(select x.x from nfc.f4role_unitprivs8check('${this.unit.code}'::character varying) x(x))`;
                break;
            case 'function':
                obj.name = 'f4' + this.unit.code.split('.')[1];
                break;
            case 'trigger':
                obj.tablename = this.unit.code.split('.')[1];
                break;
            default:
                break;
        }
        return this.objOperation({ obj, obj_type }, 'add');
    }

    onObjectUpd(event)
    {
        return this.objOperation(event.model.row, 'upd');
    }

    async onObjectCopy(event)
    {
        return this.objOperation(event.model.row, 'copy');
    }

    async onObjectDel(event)
    {
        const { obj_identity: objIdentity, obj_type: objType } = event.model.row;
        const resConfirm = await this.showConfirm(
            `Подтвердите полное удаление объекта ${objIdentity}.`,
            {
                header: 'Внимание',
                buttons: [
                    {label: 'Нет', variant: 'secondary', action: false,},
                    {label: 'Удалить', variant: 'primary', negative: true, action: true}
                ]
            }
        );
        if (resConfirm) {
            await this.$.aDropObject.execute({ objIdentity, objType });
            this.$.dsObjects.execute({unit: this.unit.code});
        }
    }

    serverEndpoints = {
        dataset: {
            dsUnitlist: {
                text: `select ul.code from nfc.v4unitlist ul order by code`
            },
            dsModulelist: {
                text: `select code from nfc.v4modulelist order by code`
            },
            dsObjects: {
                text: `select null as obj_schema,
                               null as obj_name,
                               unnest(array['table','sequence','view','function','trigger']) as "obj_fullname",
                               null as obj_identity,
                               null as obj_type
                         union all      
                        select pn.nspname,
                               p.proname,
                               pn.nspname||'.'||p.proname,
                               pn.nspname||'.'||p.proname||'('||pg_catalog.pg_get_function_identity_arguments(p.oid)||')',
                               'function'
                          from pg_catalog.pg_proc p
                               join pg_catalog.pg_namespace pn on pn.oid = p.pronamespace
                         where pn.nspname = split_part(:unit,'.',1)
                           and p.proname like 'f4'||split_part(:unit,'.',2)||'8%'
                        union all
                        select pn.nspname,
                               p.relname,
                               pn.nspname||'.'||p.relname,
                               pn.nspname||'.'||p.relname,
                               case p.relkind when 'r' then 'table' when 'v' then 'view' when 'S' then 'sequence' else '' end
                          from pg_catalog.pg_class p
                               join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace
                         where pn.nspname = split_part(:unit,'.',1)
                           and (p.relname in (split_part(:unit,'.',2),'v4'||split_part(:unit,'.',2),'s4'||split_part(:unit,'.',2)) or p.relname like 'v4'||split_part(:unit,'.',2)||'8%')
                        union all
                        select pn.nspname,
                               tr.tgname,
                               pn.nspname||'.'||p.relname||'.'||tr.tgname,
                               pn.nspname||'.'||p.relname||'.'||tr.tgname,
                               'trigger'
                          from pg_catalog.pg_class p
                               join pg_catalog.pg_namespace pn on pn.oid = p.relnamespace
                               join pg_catalog.pg_trigger tr on tr.tgrelid = p.oid
                         where pn.nspname = split_part(:unit,'.',1)
                           and p.relname = split_part(:unit,'.',2)
                           and not tr.tgisinternal`
            }
        },
        action: {
            aGet: {
                "@main": {
                    action: `select row_to_json(u)::jsonb ||
                                   json_build_object('bps',
                                      coalesce(
                                          (select array_agg(row_to_json(bps))
                                             from (select replace(b.code,b.unit||'.','') as code,
                                                          b.caption,
                                                          b.exec_function,
                                                          b.use_privs
                                                    from nfc.v4unitbps b 
                                                   where b.unit = u.code
                                                   order by 1) bps),'{}'::json[]))::jsonb as unit
                               from nfc.v4unitlist u 
                              where u.code = :code`,
                    type: 'query'
                }
            },
            aSave: {
                "@main": {
                    action: 'nfc.f4unitlist8mod',
                    type: 'func'
                },
                bps: {
                    "@add;upd": {
                        action: 'nfc.f4unitbps8mod',
                        type: 'func',
                        args: {
                            "...": '*',
                            code: '/code+"."+code',
                            unit: '/code'
                        }
                    },
                    "@del": {
                        action: 'nfc.f4unitbps8del',
                        type: 'func',
                        args: {
                            code: '/code+"."+code'
                        }
                    }
                }
            },
            aModuleSave: {
                "@main": {
                    action: 'nfc.f4modulelist8mod',
                    type: "func"
                }
            },
        }
    }//serverEndpoints
}