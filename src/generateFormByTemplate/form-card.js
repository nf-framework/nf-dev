import { DevGenerateForm } from './form.js';

/**
 * @typedef {Object} DevGenerateFormCardEntityAttributeType
 * @property {string} name имя свойства сущности, которое заполняет визуальный компонент
 * @property {string} component компонент
 * @property {string} label подпись к компоненту
 * @property {boolean} required признак обязательности для заполнения
 * @property {string?} dataName имя переменной формы с данными для выбора в компоненте (сombobox)
 * @property {string?} dataEndpoint адрес из которого будет получены данные для выбора (сombobox)
 * @property {string?} dataTextProperty имя свойства в данных для выбора для отображения (сombobox)
 * @property {string?} dataValueProperty имя свойства в данных для выбора для значения (сombobox)
 */

/**
 * Подготовка текста формы вида "Карточка" 
 */
export class DevGenerateFormCard extends DevGenerateForm {
    /** схема сущности @type {string} */
    entitySchema
    /** имя сущности @type {string} */
    entityName
    /** имя класса формы @type {string} */
    formClass
    /** заголовок формы @type {string} */
    formTitle
    /** имя свойства формы, содержащее данные редактируемой записи сущности  @type {string} */
    recordProperty
    /** компоненты ввода  @type {DevGenerateFormCardEntityAttributeType[]} */
    inputs
    /** относительный адрес метода для выборки записи сущности по идентификатору  @type {string} */
    endpointRead
    /** относительный адрес метода для создания записи сущности  @type {string} */
    endpointCreate
    /** относительный адрес метода для изменения записи сущности по идентификатору  @type {string} */
    endpointUpdate

    constructor(setting) {
        super();
        this.entitySchema = setting.entitySchema;
        this.entityName = setting.entityName;
        this.formClass = setting.formClass;
        this.formTitle = setting.formTitle;
        this.recordProperty = setting.recordProperty;
        this.endpointRead = setting.endpointRead;
        this.endpointCreate = setting.endpointCreate;
        this.endpointUpdate = setting.endpointUpdate;
        this.inputs = setting.inputs;
    }

    /**
     * Финальная подговка настроек для применения к шаблону
     * @returns {string}
     */
    prepareCompilerArgs() {
        const compilerArgs = {...this};
        compilerArgs.inputs = this.inputs.map(cmp => {
            let dataStr = '';
            if (cmp.dataName) 
                dataStr = ` data=[[${cmp.dataName}]] text-property="${cmp.dataTextProperty}" value-property="${cmp.dataValueProperty}"`;
            const required = cmp.required ? ' required' : '';
            return `<${cmp.component} label="${cmp.label}" value="{{${this.recordProperty}.${cmp.name}}}"${dataStr}${required}></${cmp.component}>`;
        }).join('\n');
        // формирование свойств и действий для combobox компонентов
        const formProperties = [];
        const dataSources = [];
        this.inputs.filter(f => f.dataName).forEach(cmp => {
            const formProperty = `${cmp.dataName}: { type: Array, value: () => [] }`; 
            formProperties.push(formProperty);
            const dataSource = `<pl-dataset id="ds_${cmp.dataName}" data="\{{${cmp.dataName}}}" endpoint="${cmp.dataEndpoint}" execute-on-args-change></pl-dataset>`;
            dataSources.push(dataSource);
        });
        compilerArgs.formProperties = formProperties.join(',\n');
        compilerArgs.dataSources = dataSources.join('\n');
        return compilerArgs;
    }

    /**
     * Преобразование информации колонок таблицы в визуальные компоненты ввода
     * @param {DevGenerateFormTableAttributeType[]} attributes 
     * @returns {DevGenerateFormCardEntityAttributeType[]}
     */
    static tableAttributesToInputs(attributes) {
        return attributes.map(attribute => {
            /** @type DevGenerateFormCardEntityAttributeType */
            const input = {
                name: attribute.name,
                component: 'pl-input',
                label: attribute.comment,
                required: attribute.required,
            }
            if (['date','timestamp','timestamptz'].indexOf(attribute.datatype) !== -1) input.component = 'pl-datetime';
            if (attribute.fk_tablename) {
                input.component = 'pl-combobox';
                input.dataName = `dsData_${attribute.name}`;
                input.dataEndpoint = `*${attribute.fk_tablename}`
            }
            return input;
        });
    }
}


