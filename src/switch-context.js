import { common, config } from '@nfjs/core';

const cfg = common.getPath(config, '@nfjs/dev.switchContext');

/**
 * Выставление в сессию пользователя данных из блока конфига, чтобы не перелогиниваться при разработке
 * @param {Context} context - сессионные данные пользователя
 */
function switchContext(context) {
    const ctx = cfg[context.body.args.ctxName];
    context.session.assign('context', ctx);
}

/**
 * Получение имен блоков в конфиге для отображения на форме переключений контекста
 * @returns {{name: string}[]}
 */
function getContextList() {
    return Object.keys(cfg).map(k => ({ name: k }));
}

export {
    switchContext,
    getContextList
};
