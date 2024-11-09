import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevUnitlist extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Модули и разделы системы' },
            modulelist: { value: () => ([]) },
            unitlist: { value: () => ([]) },
            unitbps: { value: () => ([]) },
            currModule: {},
            activeModule: { observer: 'activeModuleObserver'},
            activeUnit: {}
        }
    }

    static get css() {
        return css`
            pl-grid {
                --pl-grid-cell-min-height: 24px;
            }
            
            .modules {
                height: 100%;
                width: 400px;
            }
            
            .unitbps {
                height: 200px;
                width: 100%;
            }
        `;
    }

    static get template() {
        return html`
            <pl-flex-layout fit>
                <pl-card header="Модули" class="modules">
                    <pl-flex-layout slot="header-suffix">
                        <pl-button label="Добавить" on-click="[[onModuleAdd]]">
                            <pl-icon iconset="pl-default" icon="plus-circle" slot="prefix"></pl-icon>
                        </pl-button>
                    </pl-flex-layout>
                    <pl-grid data="[[modulelist]]" selected="{{activeModule}}">
                        <pl-grid-column field="code" header="Код"></pl-grid-column>
                        <pl-grid-column field="caption" header="Наименование"></pl-grid-column>
                        <pl-grid-column action width="72">
                            <template>
                                <style>
                                    pl-flex-layout {
                                        gap: 0px;
                                    }
                                </style>
                                <pl-flex-layout>
                                    <pl-icon-button iconset="pl-default" icon="pencil" on-click="[[onModuleUpd]]" variant="link" size="14"></pl-icon-button>
                                    <pl-icon-button iconset="pl-default" icon="trashcan" on-click="[[onModuleDel]]" size="14" variant="link"></pl-icon-button>
                                </pl-flex-layout>
                            </template>
                        </pl-grid-column>
                    </pl-grid>
                </pl-card>
                <pl-flex-layout vertical fit>
                    <pl-card fit header="Разделы">
                        <pl-flex-layout slot="header-suffix">
                            <pl-button label="Добавить" on-click="[[onUnitNew]]" variant="primary">
                                <pl-icon iconset="pl-default" icon="plus-circle" slot="prefix"></pl-icon>
                            </pl-button>
                            <pl-button label="Добавить потомка" on-click="[[onUnitNewSub]]" disabled="[[!activeUnit]]">
                                <pl-icon iconset="pl-default" icon="plus-circle" slot="prefix"></pl-icon>    
                            </pl-button>
                        </pl-flex-layout>
                        <pl-grid data="[[unitlist]]" key-field="code" pkey-field="pcode" selected="{{activeUnit}}" on-row-dblclick="[[onUnitUpd]]" tree>
                            <pl-grid-column field="code" header="Код"></pl-grid-column>
                            <pl-grid-column field="caption" header="Наименование"></pl-grid-column>
                            <pl-grid-column action width="100">
                                <template>
                                    <style>
                                        pl-flex-layout {
                                            gap: 0px;
                                        }
                                    </style>
                                    <pl-flex-layout>
                                        <pl-icon-button size="14" variant="link" iconset="pl-default" icon="pencil" on-click="[[onUnitUpd]]"></pl-icon-button>
                                        <pl-icon-button size="14" variant="link" iconset="pl-default" icon="copy" on-click="[[onUnitCopy]]"></pl-icon-button>
                                        <pl-icon-button size="14" variant="link" iconset="pl-default" icon="trashcan" on-click="[[onUnitDel]]"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-card>
                    <pl-card header="Действия в разделах" class="unitbps">
                        <pl-grid data="[[unitbps]]">
                            <pl-grid-column field="code" header="Код"></pl-grid-column>
                            <pl-grid-column field="caption" header="Наименование"></pl-grid-column>
                            <pl-grid-column field="exec_function" header="Выполняемая функция"></pl-grid-column>
                            <pl-grid-column header="Проверять права?" width="120">
                                <template>
                                    <pl-flex-layout fit justify="center">
                                        <pl-checkbox variant="horizontal" checked="{{row.use_privs}}"></pl-checkbox>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-card> 
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-dropdown id="ddModule">
                <pl-flex-layout vertical>
                    <pl-input label="Код" value="{{currModule.code}}" required></pl-input>
                    <pl-input label="Наименование" value="{{currModule.caption}}" required></pl-input>
                    <pl-flex-layout stretch>
                        <pl-button stretch label="Сохранить" on-click="[[onModuleSave]]" disabled="[[invalid]]" variant="primary">
                            <pl-icon iconset="pl-default" icon="save" slot="suffix" variant="primary"></pl-icon>
                        </pl-button>
                        <pl-button stretch label="Отменить" on-click="[[onModuleDropdownClose]]">
                            <pl-icon iconset="pl-default" icon="close-circle" slot="suffix"></pl-icon>
                        </pl-button>                                                    
                    </pl-flex-layout>
                    <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
                </pl-flex-layout>
            </pl-dropdown>
            <pl-dataset id="dsModulelist" data="{{modulelist}}" endpoint="/@nfjs/front-pl/fse/dev.unitlist/dataset/dsModulelist"></pl-dataset>
            <pl-dataset id="dsUnitlist" data="{{unitlist}}" args="[[_compose('mdl',activeModule.code)]]" required-args="mdl" execute-on-args-change endpoint="/@nfjs/front-pl/fse/dev.unitlist/dataset/dsUnitlist"></pl-dataset>
            <pl-dataset id="dsUnitbps" data="{{unitbps}}" args="[[_compose('unit',activeUnit.code)]]" required-args="unit" execute-on-args-change endpoint="/@nfjs/front-pl/fse/dev.unitlist/dataset/dsUnitbps"></pl-dataset>
            <pl-action id="aUnitDel" endpoint="/@nfjs/front-pl/fse/dev.unitlist/action/aUnitDel"></pl-action>
            <pl-action id="aModuleSave" endpoint="/@nfjs/front-pl/fse/dev.unitlist/action/aModuleSave"></pl-action>
            <pl-action id="aModuleDel" endpoint="/@nfjs/front-pl/fse/dev.unitlist/action/aModuleDel"></pl-action>
		`;
    }

    onConnect() {
        this.$.dsModulelist.execute();
    }

    async unitAdd(asChild = false) {
        await this.open('dev.unit-edit', {
            mdl: this.activeModule?.code,
            pcode: (asChild) ? this.activeUnit?.code : null,
            pcode_caption: (asChild) ? this.activeUnit?.caption : null,
            action: "add"
        });
        await this.$.dsUnitlist.execute();
    }

    async onUnitNew()
    {
        await this.unitAdd();
    }

    async onUnitNewSub() {
        await this.unitAdd(true);
    }

    async onUnitUpd(event)
    {
        await this.open('dev.unit-edit', { code: event.model.row.code, action: "upd" });
        this.$.dsUnitlist.execute();
    }

    async onUnitCopy(event)
    {
        await this.open('dev.unit-edit', { code: event.model.row.code, action: "copy" });
        this.$.dsUnitlist.execute();
    }

    async onUnitDel(event) {
        await this.$.aUnitDel.execute({code: event.model.row.code});
        this.$.dsUnitlist.execute();
    }

    onModuleAdd(event) {
        this.currModule = { code: null, caption: null };
        this.$.ddModule.open(event.target);
    }

    onModuleUpd(event) {
        this.currModule = { code: event.model.row.code, caption: event.model.row.caption };
        this.$.ddModule.open(event.target);
    }

    async onModuleSave(event) {
        await this.$.aModuleSave.execute(this.currModule);
        await this.$.dsModulelist.execute();
        this.activeModule = this.modulelist.find(m => m.code === this.currModule.code) ?? this.modulelist[0];
        this.$.ddModule.close();
    }

    onModuleDropdownClose() {
        this.$.ddModule.close();
    }

    async onModuleDel(event) {
        await this.$.aModuleDel.execute({code: event.model.row.code});
        await this.$.dsModulelist.execute();
        this.activeModule = this.modulelist[0];
    }

    activeModuleObserver(val) {
        if(val) {
            this.unitbps = [];
        }
    }

    serverEndpoints = {
        dataset: {
            dsUnitbps: {
                text: `select u.* from nfc.v4unitbps u where u.unit = :unit order by code`
            },
            dsUnitlist: {
                text: `select ul.code, ul.caption, ul.pcode from nfc.v4unitlist ul where ul.mdl = :mdl order by code`
            },
            dsModulelist: {
                text: `select * from nfc.v4modulelist order by code`
            }
        },
        action: {
            aUnitDel: {
                "@main": {
                    action: 'nfc.f4unitlist8del',
                    type: "func"
                }
            },
            aModuleDel: {
                "@main": {
                    action: 'nfc.f4modulelist8del',
                    type: "func"
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