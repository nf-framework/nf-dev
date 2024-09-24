import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevGenerateForm extends PlForm {
    static properties = { 
        formTitle: {
            type: String,
            value: 'Создание формы по шаблону'
        },
        recordCard: {
            type: Object,
            value: () => ({ recordProperty: 'record', inputs: []}),
        },
        supportCard: {
            type: Object,
            value: () => ({ schema: null, table: null })
        },
        recordList: {
            type: Object,
            value: () => ({ filters: [], columns: [] }),
        },
        supportList: {
            type: Object,
            value: () => ({ schema: null, table: null })
        },
        templatePaths: { type: Array, value: () => [] },
        formPaths: { type: Array, value: () => [] }
    }

    static template = html`
        <pl-tabpanel fit>
            <pl-tab header="Карточка">
                <pl-flex-layout fit>
                    <pl-flex-layout scrollable vertical fit>
                        <pl-flex-layout stretch>
                            <pl-flex-layout vertical fit>
                                <pl-input label="Схема сущности" title="entitySchema" value="{{recordCard.entitySchema}}" stretch required></pl-input>
                                <pl-input label="Имя сущности" title="entityName" value="{{recordCard.entityName}}" stretch required></pl-input>
                                <pl-input label="Имя класса формы" title="formClass" value="{{recordCard.formClass}}" stretch></pl-input>
                                <pl-input label="Заголовок формы" title="formTitle" value="{{recordCard.formTitle}}" stretch></pl-input>
                                <pl-input label="Имя свойства для записи сущности" title="recordProperty" value="{{recordCard.recordProperty}}" stretch></pl-input>
                            </pl-flex-layout>
                            <pl-flex-layout vertical fit>
                                <pl-input label="Адрес для получения" title="endpointRead" value="{{recordCard.endpointRead}}" stretch></pl-input>
                                <pl-input label="Адрес для создания" title="endpointCreate" value="{{recordCard.endpointCreate}}" stretch></pl-input>
                                <pl-input label="Адрес для изменения" title="endpointUpdate" value="{{recordCard.endpointUpdate}}" stretch></pl-input>
                            </pl-flex-layout>
                            <pl-valid-observer invalid="{{supportCard.invalidMain}}"></pl-valid-observer>
                        </pl-flex-layout>
                        <pl-grid data="{{recordCard.inputs}}" class="cols" >
                            <pl-flex-layout slot="top-toolbar" align="flex-end"> 
                                <pl-button label="Добавить" variant="primary" on-click="[[onAddCardAttributeClick]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                                </pl-button>
                                <pl-button label="Добавить по сущности" variant="ghost" on-click="[[onAddByTableCardAttributeClick]]" disabled="[[supportCard.invalidMain]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                                </pl-button>                                
                            </pl-flex-layout>
                            <pl-grid-column header="Атрибут сущности" resizable>
                                <template>
                                    <pl-input value="{{row.name}}" title="name" required stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Компонент" resizable>
                                <template>
                                    <pl-input value="{{row.component}}" title="component" required stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Подпись" resizable>
                                <template>
                                    <pl-input value="{{row.label}}" title="label" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Обязательный?" width="75">
                                <template>
                                    <pl-flex-layout justify="center" stretch>
                                        <pl-checkbox checked="{{row.required}}" title="required"></pl-input>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Переменная для набора данных (список)" resizable>
                                <template>
                                    <pl-input value="{{row.dataName}}" title="dataName" hidden="[[hiddenCardInputsNotCombobox(row.component)]]" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Адрес данных" resizable>
                                <template>
                                    <pl-input value="{{row.dataEndpoint}}" title="dataEndpoint" hidden="[[hiddenCardInputsNotCombobox(row.component)]]" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Свойство для отображения" resizable>
                                <template>
                                    <pl-input value="{{row.dataTextProperty}}" title="dataTextProperty" hidden="[[hiddenCardInputsNotCombobox(row.component)]]" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Свойство для значения" resizable>
                                <template>
                                    <pl-input value="{{row.dataValueProperty}}" title="dataValueProperty" hidden="[[hiddenCardInputsNotCombobox(row.component)]]" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column action width="80">
                                <template>
                                    <style>
                                        pl-flex-layout {
                                            gap: 0px;
                                        }
                                    </style>
                                    <pl-flex-layout>
                                        <pl-icon-button iconset="pl-default" icon="copy" on-click="[[onCopyCardAttributeClick]]" variant="link" size="14"></pl-icon-button>
                                        <pl-icon-button iconset="pl-default" icon="trashcan" on-click="[[onDeleteCardAttributeClick]]" variant="link" size="14"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-flex-layout>
                    <pl-flex-layout vertical fit>
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout align="flex-end" stretch>           
                                <pl-combobox label="Найденные шаблоны (*.tmplt)" value="{{supportCard.templatePath}}" data="[[templatePaths]]" text-property="path" value-property="path" stretch></pl-combobox>
                                <pl-button label="Показать" variant="ghost" on-click="[[onShowTemplateCardClick]]" disabled="[[!supportCard.templatePath]]"></pl-button>
                            </pl-flex-layout>
                            <pl-codeeditor label="Шаблон" value="{{supportCard.template}}"></pl-codeeditor>
                        </pl-flex-layout>
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout align="flex-end" stretch>
                                <pl-button label="Сгенерировать" variant="primary" on-click="[[onGenerateFormCardClick]]"></pl-button>
                                <pl-combobox label="Путь до папки forms" value="{{supportCard.formPath}}" data="[[formPaths]]" text-property="path" value-property="path" stretch></pl-combobox>
                                <pl-button label="Сохранить" variant="ghost" on-click="[[onSaveFormCardClick]]" disabled="[[saveFormDisabled(supportCard.formPath, supportCard.invalidMain, supportCard.result)]]"></pl-button>
                            </pl-flex-layout>
                            <pl-codeeditor label="Результат" value="{{supportCard.result}}" mode="javascript"></pl-codeeditor>
                        </pl-flex-layout>
                    </pl-flex-layout>
                </pl-flex-layout>
            </pl-tab>
            <pl-tab header="Реестр">
                <pl-flex-layout fit>
                    <pl-flex-layout scrollable vertical fit>
                        <pl-flex-layout stretch>
                            <pl-flex-layout vertical fit>
                                <pl-input label="Схема сущности" title="entitySchema" value="{{recordList.entitySchema}}" stretch required></pl-input>
                                <pl-input label="Имя сущности" title="entityName" value="{{recordList.entityName}}" stretch required></pl-input>
                                <pl-input label="Имя класса формы" title="formClass" value="{{recordList.formClass}}" stretch></pl-input>
                                <pl-input label="Заголовок формы" title="formTitle" value="{{recordList.formTitle}}" stretch></pl-input>
                            </pl-flex-layout>
                            <pl-flex-layout vertical fit>
                                <pl-input label="Адрес для получения" title="endpointList" value="{{recordList.endpointList}}" stretch></pl-input>
                                <pl-input label="Адрес для удаления" title="endpointDelete" value="{{recordList.endpointDelete}}" stretch></pl-input>
                                <pl-input label="Путь к форме карточки" title="cardForm" value="{{recordList.cardForm}}" stretch></pl-input>
                            </pl-flex-layout>
                            <pl-valid-observer invalid="{{supportList.invalidMain}}"></pl-valid-observer>
                        </pl-flex-layout>
                        <pl-grid data="{{recordList.columns}}" header="Колонки" class="cols">
                            <pl-flex-layout slot="top-toolbar" align="flex-end"> 
                                <pl-button label="Добавить" variant="primary" on-click="[[onAddListAttributeClick]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                                </pl-button>
                                <pl-button label="Добавить по сущности" variant="ghost" on-click="[[onAddByTableListAttributeClick]]" disabled="[[supportList.invalidMain]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                                </pl-button>
                            </pl-flex-layout>
                            <pl-grid-column header="Атрибут сущности" resizable>
                                <template>
                                    <pl-input value="{{row.field}}" title="field" required stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Заголовок" resizable>
                                <template>
                                    <pl-input value="{{row.header}}" title="header" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Ширина колонки" resizable>
                                <template>
                                    <pl-input value="{{row.width}}" title="width" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Изменяемая ширина?" width="75">
                                <template>
                                    <pl-flex-layout justify="center" stretch>
                                        <pl-checkbox checked="{{row.resizable}}" title="resizable"></pl-input>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Сортировка?" width="75">
                                <template>
                                    <pl-flex-layout justify="center" stretch>
                                        <pl-checkbox checked="{{row.sortable}}" title="sortable"></pl-input>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Направление сортировки" resizable>
                                <template>
                                    <pl-input value="{{row.sort}}" title="dataName" hidden="[[!row.sortable]]" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Вид отображения" resizable>
                                <template>
                                    <pl-input value="{{row.kind}}" title="kind" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Шаблон преобразования" resizable>
                                <template>
                                    <pl-input value="{{row.format}}" title="format" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column action width="100">
                                <template>
                                    <style>
                                        pl-flex-layout {
                                            gap: 0px;
                                        }
                                    </style>
                                    <pl-flex-layout>
                                        <pl-icon-button iconset="pl-default" icon="filter" on-click="[[onCreateListFilterByAttributeClick]]" variant="link" size="14"></pl-icon-button>
                                        <pl-icon-button iconset="pl-default" icon="copy" on-click="[[onCopyListAttributeClick]]" variant="link" size="14"></pl-icon-button>
                                        <pl-icon-button iconset="pl-default" icon="trashcan" on-click="[[onDeleteListAttributeClick]]" variant="link" size="14"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                        <pl-grid data="{{recordList.filters}}" header="Фильтры" class="cols">
                            <pl-flex-layout slot="top-toolbar" align="flex-end"> 
                                <pl-button label="Добавить" variant="primary" on-click="[[onAddListFilterClick]]">
                                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                                </pl-button>
                            </pl-flex-layout>
                            <pl-grid-column header="Атрибут сущности" resizable>
                                <template>
                                    <pl-input value="{{row.field}}" title="field" required stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Компонент ввода" resizable>
                                <template>
                                    <pl-input value="{{row.component}}" title="component" required stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Подпись" resizable>
                                <template>
                                    <pl-input value="{{row.label}}" title="label" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Оператор" resizable>
                                <template>
                                    <pl-input value="{{row.operator}}" title="operator" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column header="Преобразование" resizable>
                                <template>
                                    <pl-input value="{{row.cast}}" title="cast" stretch></pl-input>
                                </template>
                            </pl-grid-column>
                            <pl-grid-column action width="80">
                                <template>
                                    <style>
                                        pl-flex-layout {
                                            gap: 0px;
                                        }
                                    </style>
                                    <pl-flex-layout>
                                        <pl-icon-button iconset="pl-default" icon="copy" on-click="[[onCopyListFilterClick]]" variant="link" size="14"></pl-icon-button>
                                        <pl-icon-button iconset="pl-default" icon="trashcan" on-click="[[onDeleteListFilterClick]]" variant="link" size="14"></pl-icon-button>
                                    </pl-flex-layout>
                                </template>
                            </pl-grid-column>
                        </pl-grid>
                    </pl-flex-layout>
                    <pl-flex-layout vertical fit>
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout align="flex-end" stretch>           
                                <pl-combobox label="Найденные шаблоны (*.tmplt)" value="{{supportList.templatePath}}" data="[[templatePaths]]" text-property="path" value-property="path" stretch></pl-combobox>
                                <pl-button label="Показать" variant="ghost" on-click="[[onShowTemplateListClick]]" disabled="[[!supportList.templatePath]]"></pl-button>
                            </pl-flex-layout>
                            <pl-codeeditor label="Шаблон" value="{{supportList.template}}"></pl-codeeditor>
                        </pl-flex-layout>
                        <pl-flex-layout vertical fit>
                            <pl-flex-layout align="flex-end" stretch>
                                <pl-button label="Сгенерировать" variant="primary" on-click="[[onGenerateFormListClick]]"></pl-button>
                                <pl-combobox label="Путь до папки forms" value="{{supportList.formPath}}" data="[[formPaths]]" text-property="path" value-property="path" stretch></pl-combobox>
                                <pl-button label="Сохранить" variant="ghost" on-click="[[onSaveFormListClick]]" disabled="[[saveFormDisabled(supportList.formPath, supportList.invalidMain, supportList.result)]]"></pl-button>
                            </pl-flex-layout>
                            <pl-codeeditor label="Результат" value="{{supportList.result}}" mode="javascript"></pl-codeeditor>
                        </pl-flex-layout>
                    </pl-flex-layout>
                </pl-flex-layout>
            </pl-tab>
        </pl-tabpanel>
        <pl-action id="aGetEntityAttributesForCard" endpoint="/@nfjs/dev/api/generateFormByTemplate/card/entityAttributes"></pl-action>
        <pl-action id="aGetEntityAttributesForList" endpoint="/@nfjs/dev/api/generateFormByTemplate/list/entityAttributes"></pl-action>
        <pl-action id="aGenerate" endpoint="/@nfjs/dev/api/generateFormByTemplate"></pl-action>
        <pl-action id="getTemplatePaths" data="{{templatePaths}}" endpoint="/@nfjs/dev/api/generateFormByTemplate/getTemplatePaths"></pl-action>
        <pl-action id="getTemplateByPath" endpoint="/@nfjs/dev/api/generateFormByTemplate/getTemplateByPath"></pl-action>
        <pl-action id="aGetFormPaths" data="{{formPaths}}" endpoint="/@nfjs/dev/api/generateFormByTemplate/getFormPaths"></pl-action>
        <pl-action id="aSaveForm" endpoint="/@nfjs/dev/api/generateFormByTemplate/saveForm"></pl-action>
    `;

    async onConnect() {
        this.$.getTemplatePaths.execute();
        this.$.aGetFormPaths.execute();
        if (this.entitySchema) {
            this.set('recordCard.entitySchema', this.entitySchema);
            this.set('recordList.entitySchema', this.entitySchema);
        }
        if (this.entityName) {
            this.set('recordCard.entityName', this.entityName);
            this.set('recordList.entityName', this.entityName);
        }
        if (this.formTitle) {
            this.set('recordCard.formTitle', this.formTitle);
            this.set('recordList.formTitle', this.formTitle);
        }
        if (this.entitySchema && this.entityName) {
            const capitalizeFirst = s => s[0].toUpperCase() + s.slice(1);
            this.set('recordCard.formClass', `${capitalizeFirst(this.entitySchema)}${capitalizeFirst(this.entityName)}Card`);
            this.set('recordList.formClass', `${capitalizeFirst(this.entitySchema)}${capitalizeFirst(this.entityName)}List`);
            this.onAddByTableCardAttributeClick();
            this.onAddByTableListAttributeClick();
        }
    }

    async onGenerateFormCardClick() {
        const res = await this.$.aGenerate.execute({ 
            formSetting: this.recordCard, 
            formType: 'card', 
            template: this.supportCard.template, 
            templatePath: this.supportCard.templatePath
        });
        this.set('supportCard.result', res.formText);
    }

    async onSaveFormCardClick() {
        const res = await this.$.aSaveForm.execute({ 
            formType: 'card', 
            formContent: this.supportCard.result,
            formPath: this.supportCard.formPath, 
            entitySchema: this.recordCard.entitySchema,
            entityName: this.recordCard.entityName,
        });
        this.notify(res.filePath, { header: 'Форма успешно сохранена по пути:' });
    }

    onAddCardAttributeClick(event) {
        this.push('recordCard.inputs', {});
    }

    async onAddByTableCardAttributeClick(event) {
        const res = await this.$.aGetEntityAttributesForCard.execute({ schema: this.recordCard.entitySchema, table: this.recordCard.entityName });
        if (res) this.push('recordCard.inputs', [...res]);
    }

    onCopyCardAttributeClick(event) {
        this.push('recordCard.inputs', Object.assign({}, event.model.row));
    }

    onDeleteCardAttributeClick(event) {
        const idx = this.recordCard.inputs.findIndex(i => i === event.model.row);
        this.splice('recordCard.inputs', idx, 1);
    }

    hiddenCardInputsNotCombobox(component) {
        return component !== 'pl-combobox';
    }

    async onShowTemplateCardClick() {
        const res = await this.$.getTemplateByPath.execute({ templatePath: this.supportCard.templatePath});
        if (res) this.set('supportCard.template', res.template);
    }

    async onGenerateFormListClick() {
        const res = await this.$.aGenerate.execute({ 
            formSetting: this.recordList, 
            formType: 'list', 
            template: this.supportList.template, 
            templatePath: this.supportList.templatePath
        });
        this.set('supportList.result', res.formText);
    }

    async onSaveFormListClick() {
        const res = await this.$.aSaveForm.execute({ 
            formType: 'list', 
            formContent: this.supportList.result,
            formPath: this.supportList.formPath, 
            entitySchema: this.recordList.entitySchema,
            entityName: this.recordList.entityName,
        });
        this.notify(res.filePath, { header: 'Форма успешно сохранена по пути:' });
    }

    onAddListAttributeClick(event) {
        this.push('recordList.columns', {});
    }

    async onAddByTableListAttributeClick(event) {
        const res = await this.$.aGetEntityAttributesForList.execute({ schema: this.recordList.entitySchema, table: this.recordList.entityName });
        if (res) this.push('recordList.columns', [...res]);
    }

    onCreateListFilterByAttributeClick(event) {
        const { row } = event.model;
        this.push('recordList.filters', {
            field: row.field,
            label: row.header,
            component: 'pl-input',
            operator: '='    
        });
    }

    onCopyListAttributeClick(event) {
        this.push('recordList.columns', Object.assign({}, event.model.row));
    }

    onDeleteListAttributeClick(event) {
        const idx = this.recordList.columns.findIndex(i => i === event.model.row);
        this.splice('recordList.columns', idx, 1);
    }

    async onShowTemplateListClick() {
        const res = await this.$.getTemplateByPath.execute({ templatePath: this.supportList.templatePath});
        if (res) this.set('supportList.template', res.template);
    }

    onAddListFilterClick(event) {
        this.push('recordList.filters', {});
    }

    onCopyListFilterClick(event) {
        this.push('recordList.filters', Object.assign({}, event.model.row));
    }

    onDeleteListFilterClick(event) {
        const idx = this.recordList.filters.findIndex(i => i === event.model.row);
        this.splice('recordList.filters', idx, 1);
    }

    saveFormDisabled(formPath, invalidMain, result) {
        return !formPath || invalidMain || !result;
    }

}
