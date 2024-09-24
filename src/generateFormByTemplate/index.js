import fs from 'fs';
import { join } from 'path';
import { dbapi } from '@nfjs/back';
import { extension } from '@nfjs/core';
import { DevGenerateFormCard } from './form-card.js';
import { DevGenerateFormList } from './form-list.js';

const TABLE_ATTRIBUTES_SQL = `select attr.attname as name,
    tp.typname as datatype,
    attr.attnotnull as required,
    ds.description as comment,
    (select fks.nspname||'.'||fk.relname
    from pg_catalog.pg_constraint  fk_cns
            join pg_catalog.pg_class fk on (fk.oid = fk_cns.confrelid)
            join pg_catalog.pg_namespace fks on (fks.oid = fk.relnamespace)
    where fk_cns.conrelid = t.oid
        and attr.attnum = any(fk_cns.conkey)
    limit 1) as fk_tablename
    from pg_catalog.pg_namespace nsp,
    pg_catalog.pg_class t, 
    pg_catalog.pg_attribute attr
    left join pg_catalog.pg_description ds on (ds.objoid = attr.attrelid and ds.objsubid = attr.attnum)
    join pg_catalog.pg_type tp on tp.oid = attr.atttypid
    where nsp.nspname = :schema 
    and t.relnamespace = nsp.oid 
    and t.relname = :table
    and attr.attrelid = t.oid
    and attr.attnum > 0
    and not attr.attisdropped
    order by attr.attnum asc
`;

/**
 * @typedef DevGenerateFormTableAttributeType
 * @property {string} name имя
 * @property {string} datatype тип данных
 * @property {boolean} required признак обязательности
 * @property {string} comment комментарий
 * @property {string} fk_tablename полное имя таблицы, на которую ссылается атрибут
 */

/**
 * Генерация формы вида "Карточка"
 * @param {Object} formSetting изменяемые настройки формы
 * @param {string} template шаблону формы
*/
async function generateFormCard(formSetting, template, templatePath) {
    const formCard = new DevGenerateFormCard(formSetting);
    let _template = template;
    if (!_template) {
        const buf = await fs.promises.readFile(templatePath);
        _template = buf.toString();
    }
    return formCard.useTemplate(_template);  
}

/**
 * Генерация формы вида "Реестр"
 * @param {Object} formSetting изменяемые настройки формы
 * @param {string} template шаблону формы
*/
async function generateFormList(formSetting, template, templatePath) {
    const formCard = new DevGenerateFormList(formSetting);
    let _template = template;
    if (!_template) {
        const buf = await fs.promises.readFile(templatePath);
        _template = buf.toString();
    }
    return formCard.useTemplate(_template);  
}

export async function generateFormHandler(context) {
    try {
        const { formSetting, formType, template, templatePath } = context.body.args;
        let formText;
        if (formType === 'card') formText = await generateFormCard(formSetting, template, templatePath);
        else formText = await generateFormList(formSetting, template);
        context.send({ data: { formText }});
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

async function getEntityAttributesForCard(context, schema, table) {
    let connect; 
    try {
        const connect = await dbapi.getConnect(context);
        const queryResult = await connect.query(TABLE_ATTRIBUTES_SQL, { schema, table });
        const result = DevGenerateFormCard.tableAttributesToInputs(queryResult.data || []);
        return result;
    } finally {
        if (connect) await connect.release();
    }
}

export async function getEntityAttributesForCardHandler(context) {
    try {
        const { schema, table } = context.body.args;
        const attributes = await getEntityAttributesForCard(context, schema, table);
        context.send({ data: attributes });
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

async function getEntityAttributesForList(context, schema, table) {
    let connect; 
    try {
        const connect = await dbapi.getConnect(context);
        const queryResult = await connect.query(TABLE_ATTRIBUTES_SQL, { schema, table });
        const result = DevGenerateFormList.tableAttributesToColumns(queryResult.data || []);
        return result;
    } finally {
        if (connect) await connect.release();
    }
}

export async function getEntityAttributesForListHandler(context) {
    try {
        const { schema, table } = context.body.args;
        const attributes = await getEntityAttributesForList(context, schema, table);
        context.send({ data: attributes });
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

export async function getTemplatePathsHandler(context) {
    try {
        const templatesFind = await extension.getFiles('**/*.tmplt', { resArray: true, onlyExt: true });
        const result = templatesFind.map(path => ({ path }));
        context.send({ data: result });
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

export async function getTemplateByPathHandler(context) {
    try {
        const { templatePath } = context?.body?.args;
        const buf = await fs.promises.readFile(templatePath);
        context.send({ data: { template: buf.toString() }});
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

export async function getFormPathsHandler(context) {
    try {
        const formsDirFind = await extension.getFiles('**/forms', { resArray: true, onlyExt: true, isDir: true });
        const result = formsDirFind.map(path => ({ path }));
        context.send({ data: result });
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

export async function saveFormsHandler(context) {
    try {
        const { formType, formContent, formPath, entitySchema, entityName } = context.body.args;
        //
        const saveDir = join(formPath, entitySchema, entityName);
        try {
            await fs.promises.mkdir(saveDir, { recursive: true });
        } catch (e) {
            if (!(e.code === 'EEXIST')) throw (e);
        }
        const filePath = join(saveDir, `${formType}.js`);
        await fs.promises.writeFile(filePath, formContent);
        context.send({ data: { filePath }});
    } catch (e) {
        console.error(e);
        context.code(500).send(e.message);
    }
}

const testCard = async () => {
    const testFormSetting = {
        formClass: 'test',
        formTitle: 'testing',
        recordProperty: 'record',
        inputs: [
            { name: 'code', component: 'pl-input', label: 'Код', required: true },
            { name: 'fk', component: 'pl-combobox', label: 'Ссылка', dataName: 'fkData', dataEndpoint: '/api/fk/combo', dataTextProperty: 'description', dataValueProperty: 'id' },
            { name: 'fk2', component: 'pl-combobox', label: 'Ссылка2', dataName: 'fkData2', dataEndpoint: '/api/fk/combo2', dataTextProperty: 'description', dataValueProperty: 'id' }
        ]
    }
    const formText = await generateFormCard(testFormSetting, null,'./node_modules/@nfjs/dev/src/generateFormByTemplate/form-card.tmplt'); 
    console.log(formText);
}

const testList = async () => {
    const testFormSetting = {
        formClass: 'test',
        formTitle: 'testing',
        endpointList: '/api/list',
        endpointDelete: '/api/delete',
        cardFormEdit: 'test.card',
        cardFormAdd: 'test.card',
        filters: [
            { field: 'code', component: 'pl-input', label: 'Код' },
            { field: 'f1', component: 'pl-combobox', label: 'Ссылка', operator: '!==' },
            { field: 'f2', component: 'pl-combobox', label: 'Ссылка2', operator: '@>', cast: 'lower' }
        ],
        columns: [
            { field: 'code', header: 'Код' },
            { field: 'f1', header: 'Код1', width: '100' },
            { field: 'f2', header: 'Код2', resizable: true },
            { field: 'f3', header: 'Код3', sortable: true, sort: 'asc' },
            { field: 'f4', header: 'Код4', kind: 'date', format: 'DD.MM.YYYY' },
        ],
    }
    const formText = await generateFormList(testFormSetting, null,'./node_modules/@nfjs/dev/src/generateFormByTemplate/form-list.tmplt'); 
    console.log(formText);
}

//testCard();
//testList();
