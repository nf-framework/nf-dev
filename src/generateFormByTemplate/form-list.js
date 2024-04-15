import { DevGenerateForm } from './form.js';

/**
 * @typedef {Object} DevGenerateFormListFilterType
 * @property {string} field имя свойства сущности, по которому фильтрация
 * @property {string} component компонент ввода значения фильтра
 * @property {string} label подпись к компоненту
 * @property {string?} operator оператор фильтрации
 * @property {string?} cast выполняемое преобразование типа данных значения фильтра
 */

/**
 * @typedef {Object} DevGenerateFormListColumnType
 * @property {string} field имя свойства сущности
 * @property {string} header заголовок
 * @property {number?} width ширина колонки
 * @property {boolean?} resizable признак возможности менять ширину 
 * @property {boolean?} sortable признак возможности сортировки
 * @property {string?} sort направление сортировки
 * @property {string?} kind вид отображения (например для datetime) 
 * @property {string?} format шаблон преобразования значения (например для datetime)
 */

/**
 * Подготовка текста формы вида "Реестр списком" 
 */
export class DevGenerateFormList extends DevGenerateForm {
    /** схема сущности @type {string} */
    entitySchema
    /** имя сущности @type {string} */
    entityName
    /** имя класса формы @type {string} */
    formClass
    /** заголовок формы @type {string} */
    formTitle
    /** компоненты фильтрации @type {DevGenerateFormListFilterType[]} */
    filters
    /** колонки списка @type {DevGenerateFormListColumnType[]} */
    columns
    /** относительный адрес метода для выборки записей  @type {string} */
    endpointList
    /** относительный адрес метода для удаления записи сущности по идентификатору  @type {string} */
    endpointDelete
    /** путь к форме карточке для создания\редактирования записи @type {string} */
    cardForm

    constructor(setting) {
        super();
        this.entitySchema = setting.entitySchema;
        this.entityName = setting.entityName;
        this.formClass = setting.formClass;
        this.formTitle = setting.formTitle;
        this.filters = setting.filters;
        this.columns = setting.columns;
        this.endpointList = setting.endpointList;
        this.endpointDelete = setting.endpointDelete;
        this.cardForm = setting.cardForm;
    }

    /**
     * Финальная подговка настроек для применения к шаблону
     * @returns {string}
     */
    prepareCompilerArgs() {
        const compilerArgs = {...this};
        compilerArgs.filters = this.filters.map(filterItem => {
            const input = `<${filterItem.component} label="${filterItem.label}"></${filterItem.component}>`;
            const operator = filterItem.operator ? ` operator="${filterItem.operator}"` : '';
            const cast = filterItem.cast ? ` cast="${filterItem.cast}"` : '';
            return `<pl-filter-item field="${filterItem.field}"${operator}${cast}>${input}</pl-filter-item>`
        }).join('\n');
        compilerArgs.columns = this.columns.map(column => {
            const header = column.header ? ` header="${column.header}"` : '';
            const width = column.width ? ` width="${column.width}"` : '';
            const resizable = column.resizable ? ` resizable` : '';
            const sortable = column.sortable ? ` sortable` : '';
            const sort = column.sort ? ` sort="${column.sort}"` : '';
            const kind = column.kind ? ` kind="${column.kind}"` : '';
            const format = column.format ? ` format="${column.format}"` : '';
            return `<pl-grid-column field="${column.field}"${header}${width}${kind}${format}${sort}${sortable}${resizable}></pl-grid-column>`
        }).join('\n');
        return compilerArgs;
    }

    /**
     * Преобразование информации колонок таблицы в колонки компонента список
     * @param {DevGenerateFormTableAttributeType[]} attributes 
     * @returns {DevGenerateFormListColumnType[]}
     */
    static tableAttributesToColumns(attributes) {
        return attributes.map(attribute => {
            /** @type DevGenerateFormCardEntityAttributeType */
            const column = {
                field: attribute.name,
                header: attribute.comment,
                resizable: true,
                sortable: false
            }
            return column;
        });
    }
}              
               