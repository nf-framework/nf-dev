import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

import { NFMig, NFMigObj, sourceFiles, utils as migUtils } from '@nfjs/migrate';
import { dbapi } from '@nfjs/back';
import { NFEi } from '@nfjs/ei';
import { container, config, extension } from '@nfjs/core';
import { DboTable } from '@nfjs/dbo-compare';

/**
 * @typedef {Object} MPObjType
 * @property {string} object_type тип объекта базы данных
 * @property {string} object_schema схема
 * @property {string} object_name имя
 */

/**
 * Сохранение выбранных объектов бд в исходники
 * @param {Context} context сессионные данные пользователя
 * @param {Object} args параметры выполнения
 * @param {Array<MPObjType>} args.objs массив объектов для сохранения
 * @param {boolean} [args.markApplied = true] отмечать в default провайдере, что объекты уже применены или нет
 * @returns {Promise<Array<Object>>}
 */
async function saveObjs(context, args) {
    const { objs, markApplied = true } = args;
    const schMdls = await migUtils.getSchemaModules();
    const connect = await dbapi.getConnect(context);
    const res = {};
    let _errObject;
    try {
        await connect.begin();
        let checkNfd = false;
        if (markApplied) {
            const resCheckNfd = await connect.query(`select exists (select null from information_schema.schemata k 
                          where k.schema_name = 'nfd') as "using"`, {}, { returnFirst: true });
            checkNfd = resCheckNfd?.data?.using;
        }
        const notSaved = [];
        for (const obj of objs) {
            // сохраняем только объекты схем, для которых есть хранилище в модулях. Важно, что одна схема может
            // относится только к одному модулю
            _errObject = `${obj.object_type} ${obj.object_schema}.${obj.object_name}`;
            if (schMdls[obj.object_schema]) {
                const res = await connect.query(
                    'select public.nf_get_objsrc(:type, :schema, :name) as obj',
                    { type: obj.object_type, schema: obj.object_schema, name: obj.object_name },
                    { returnFirst: true }
                );
                const dbObj = res.data.obj;
                const objSrc = NFMigObj.getTextFromDbObj(obj.object_type, dbObj);
                await sourceFiles.saveObjToFile(schMdls[obj.object_schema], obj.object_schema, obj.object_name, obj.object_type, objSrc);
                // отметить в текущей бд, что объект с таким хешем уже выполнен на ней, если схема nfd присутствует
                if (markApplied && checkNfd) {
                    await connect.func('nfd.f_nf_objects8mod', {
                        p_obj_type: obj.object_type,
                        p_obj_schema: obj.object_schema,
                        p_obj_name: obj.object_name,
                        p_hash: NFMigObj.getHash(objSrc),
                    });
                }
            } else {
                notSaved.push(obj);
                obj.savedSuccessfully = false;
            }
        }
        await connect.commit();
        if (notSaved && notSaved.length > 0) {
            const _o = notSaved.map((o) => `${o.object_schema}.${o.object_name}`).join();
            let _s = notSaved.map((o) => o.object_schema);
            _s = [...new Set(_s)]; // только уникальные
            res.message = `Объекты: [${_o}] не были сохранены. Не найдены для схем [${_s}] структуры в папках dbsrc подключенных модулей приложения.`;
        } else {
            res.message = 'Все объекты успешно сохранены';
        }
        res.messageType = 'success';
    } catch (e) {
        await connect.rollback();
        res.message = `Сохранение объекта [${_errObject}] произошло с ошибкой [${e.message}]`;
        res.messageType = 'error';
        container.logger.error(e);
    } finally {
        if (connect) connect.release();
    }
    return res;
}

/**
 * @typedef {Object} MPMigType
 * @property {string} name имя
 * @property {string} script содержание
 */

/**
 * Сохранение миграций бд в исходники
 * @param {Context} context сессионные данные пользователя
 * @param {Object} args параметры выполнения
 * @param {Array<MPMigType>} args.migrations массив объектов для сохранения
 * @param {boolean} [args.markApplied = true] отмечать в default провайдере, что объекты уже применены или нет
 * @returns {Promise<void>}
 */
async function saveMigrations(context, args) {
    const { migrations, markApplied = true } = args;
    const res = {};
    const connect = await dbapi.getConnect(context);
    let _errMigration;
    try {
        await connect.begin();
        let checkNfd = false;
        if (markApplied) {
            const resCheckNfd = await connect.query(`select exists (select null from information_schema.schemata k 
                          where k.schema_name = 'nfd') as "using"`, {}, { returnFirst: true });
            checkNfd = resCheckNfd?.data?.using;
        }
        for (const mig of migrations) {
            _errMigration = mig.name;
            await sourceFiles.saveMigrationToFile(mig.name, mig.script);
            // отметить в текущей бд, что миграция прогнана
            if (markApplied && checkNfd) {
                const mName = mig.name.replace(/\.sql$/, '');
                await connect.func('nfd.f_nf_migrations8mod', { p_filename: mName });
            }
        }
        await connect.commit();
        res.message = 'Все миграции успешно сохранены';
        res.messageType = 'success';
    } catch (e) {
        await connect.rollback();
        res.message = `Сохранение миграции [${_errMigration}] произошло с ошибкой [${e.message}].`;
        res.messageType = 'error';
        container.logger.error(e);
    } finally {
        if (connect) connect.release();
    }
    return res;
}

/**
 * @typedef {Object} MPDatType
 * @property {string} dataFile абсолютный путь к файлу для данных таблицы
 * @property {boolean} eCommon признак, что схемы выгрузки\загрузки находятся в модуле мигратора и общие на все модули(схемы)
 * @property {string} eSchFile путь к файлу схемы выгрузки из бд данных по таблице
 * @property {string} iSchFile путь к файлу схемы загрузки в бд данных по таблице
 * @property {string} schema схема бд таблицы
 * @property {string} table имя таблицы
 */

/**
 * Сохранение данных, выбранных на форме таблиц
 * @param {Context} context сессионные данные пользователя
 * @param {Object} args параметры выполнения
 * @param {Array<MPDatType>} args.dats данные выбранных схем для манипуляции с данными таблиц
 * @param {boolean} [args.markApplied = true] признак отметки в текущей бд для мигратора, что данные в бд и исходниках уже синхронизированы
 * @returns {Promise<void>}
 */
async function saveDats(context, args) {
    const { dats, markApplied = true } = args;
    const res = {};
    const connect = await dbapi.getConnect(context);
    let _errDat;
    try {
        await connect.begin();
        let checkNfd = false;
        if (markApplied) {
            const resCheckNfd = await connect.query(`select exists (select null from information_schema.schemata k 
                          where k.schema_name = 'nfd') as "using"`, {}, { returnFirst: true });
            checkNfd = resCheckNfd?.data?.using;
        }
        for (const dat of dats) {
            const { table, schema, eSchFile, dataFile, eCommon } = dat;
            if (schema) { // иначе это просто верхний узел в дереве из-за getDats
                _errDat = `${schema}|${table}`;
                const filter = ((eCommon) ? { schema } : undefined);
                await NFEi.exportBySchemeFile(context, eSchFile, dataFile, filter);
                // отметить в текущей бд, что данные прогнаны
                const src = await readFile(dat.dataFile, 'utf8');
                const hash = await migUtils.getHash(src);
                if (markApplied && checkNfd) {
                    await connect.func('nfd.f_nf_objects8mod', {
                        p_obj_type: 'data',
                        p_obj_schema: dat.schema,
                        p_obj_name: dat.table,
                        p_hash: hash,
                    });
                }
            }
        }
        await connect.commit();
        res.message = 'Все файлы данных успешно подготовлены и сохранены';
        res.messageType = 'success';
    } catch (e) {
        await connect.rollback();
        res.message = `Сохранение файла данных [${_errDat}] произошло с ошибкой [${e.message}].`;
        res.messageType = 'error';
        container.logger.error(e);
    } finally {
        if (connect) connect.release();
    }
    return res;
}

/**
 * Получение списка для дерева настроенных схем выгрузок данных таблиц в исходники
 * @returns {Promise<Array<MPDatType>>}
 */
async function getDats() {
    const sch = await migUtils.getSchemaModules();
    const dats = await sourceFiles.getAllDatFiles();
    return dats.concat(Object.keys(sch).map((s) => ({
        iSchFile: null,
        eSchFile: null,
        dataFile: null,
        schema: null,
        table: s
    })));
}

/**
 * Генерация схемы экспорта\импорта для данных таблицы
 * @param {Context} context сессионные данные пользователя
 * @param {Object} args параметры выполнения
 * @param {string} args.schema схема бд таблицы
 * @param {string} args.table имя таблицы
 * @param {Array<string>} args.columns перечень колонок включаемых в схему
 * @param {Array<string>} args.ukColumns перечень колонок образующих уникальный ключ для сопоставления
 * @returns Promise<void>
 */
async function generateDefaultDats(context, args) {
    const { schema, table, columns, ukColumns } = args;
    const fullTableName = `${schema}.${table}`;
    let connect, src;
    try {
        connect = await dbapi.getConnect(context);
        src = await DboTable.get(connect._connect, { schema, name: table });
    } finally {
        if (connect) await connect.release();
    }
    const mdl = await migUtils.getSchemaModules(schema);
    const ext = extension.getExtensions();
    const mdlPath = ext.find((e) => e.name === mdl).dirname;
    const fields = (columns && columns.length > 0) ? columns : src.cols.map((c) => c.name);
    let pk = src.cons && src.cons.find((cn) => cn.type === 'p');
    if (pk) { pk = pk.columns; } else { pk = 'id'; }
    let uk;
    if (ukColumns && ukColumns.length > 0) {
        uk = ukColumns;
    } else {
        uk = src.cons && src.cons.find((cn) => cn.type === 'u');
        uk = (uk && uk.columns) ? uk.columns.split(',') : ['id'];
    }
    const eSchContent = {
        schema: {
            main: fullTableName,
            extract: {
                [fullTableName]: {
                    type: 'db',
                    table: fullTableName,
                    pk,
                    output: 'named',
                    fields
                }
            },
            load: {
                type: 'jsonString'
            }
        }
    };
    const iSchContent = {
        schema: {
            main: fullTableName,
            extract: {
                [fullTableName]: {
                    type: 'json',
                    valueScoped: true
                }
            },
            load: {
                type: 'execSqlArray',
                unitField: '$0',
                unitData: ':$0',
                units: {
                    [fullTableName]: {
                        type: 'db',
                        tablename: fullTableName,
                        pk,
                        uk,
                        fields
                    }
                }
            }
        }
    };

    const saveDir = join(mdlPath, 'dbsrc', schema, 'dat', fullTableName);
    try {
        await mkdir(saveDir, { recursive: true });
    } catch (e) {
        if (!(e.code === 'EEXIST')) throw (e);
    }
    await writeFile(join(saveDir, 'data.json'), '');
    await writeFile(join(saveDir, 'eSch.json'), JSON.stringify(eSchContent, null, 2));
    await writeFile(join(saveDir, 'iSch.json'), JSON.stringify(iSchContent, null, 2));
}

/**
 * Формирование имени миграции
 * @param {Context} context сессионные данные пользователя
 * @param {Object} args параметры выполнения
 * @param {string} args.schema схема базы данных
 * @param {number} args.count номер по счету
 * @param {string} args.comment комментарий к миграции
 * @returns {Promise<string>}
 */
async function getMigrationName(context, args) {
    const { schema, count, comment } = args;
    return NFMig.createName(schema, count, comment);
}

/**
 * Получение настроек для работы основной формы подготовки исходников базы данных
 * @param {Context} context сессионные данные пользователя
 * @returns {{config:Object,options:Object}}
 */
async function getOptions(context) {
    const defaultConfig = {
        limitObjectsByOwner: true,
        limitSchemasByApp: true,
        markApplied: true,
    };
    const schemas = await migUtils.getSchemaModules();
    const optionsRes = await dbapi.query(
        `select exists (select k.schema_name from information_schema.schemata k where k.schema_name = 'nfd') as using_nfd`,
        {},
        { context, returnFirst: true }
    );
    const res = Object.assign({}, defaultConfig, config?.['@nfjs/dev']?.dbSourceSave ?? {}, optionsRes?.data ?? {});
    res.schemas = Object.keys(schemas).join();

    const ext = extension.getExtensions();
    res.extensions = ext.map(e => ({ name: e.name }));
    return res;
}

const getSchemaModules = migUtils.getSchemaModules;

async function prepareSchemaInModule(context, args) {
    const { schema, mdl, useUnits = false } = args;

    const ext = extension.getExtensions();
    const mdlPath = ext.find((e) => e.name === mdl).dirname;

    const saveDir = join(mdlPath, 'dbsrc', schema);
    try {
        await mkdir(saveDir, { recursive: true });
    } catch (e) {
        if (!(e.code === 'EEXIST')) throw (e);
    }
    await mkdir(join(saveDir, 'src'));
    await mkdir(join(saveDir, 'mig'));
    await mkdir(join(saveDir, 'dat'));
    if (useUnits) {
        const pt = join(saveDir, 'dat', 'nfc.modulelist');
        await mkdir(pt);
        await writeFile(join(pt, 'data.json'), '');
    }
}

export {
    getSchemaModules,
    getDats,
    saveDats,
    generateDefaultDats,
    saveMigrations,
    saveObjs,
    getMigrationName,
    getOptions,
    prepareSchemaInModule,
};
