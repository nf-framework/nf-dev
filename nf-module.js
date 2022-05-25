import path from 'path';
import { api as nfApi } from '@nfjs/core';
import { web } from '@nfjs/back';
import * as dbSourceSave from './src/db-source-save.js';
import * as sc from "./src/switch-context.js";

const meta = {
    require: {
        after: '@nfjs/back'
    }
};

const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, "$1");
let menu = await nfApi.loadJSON(__dirname+'/menu.json');

async function init() {
    web.on('POST', '/@nfjs/dev/api/db-source-save/:method', { middleware: ['session','json'] },async (context) => {
        try {
            const { method } = context.params;
            const resMethodExec = await dbSourceSave[method](context, context.body && context.body.args);
            context.send({ data: resMethodExec});
        } catch (e) {
            context.code(500).send(e.message);
        }
    });

    web.on('POST', '/@nfjs/dev/api/getContextList', async (context) => {
        const data = sc.getContextList();
        context.send({ data: data});
    });

    web.on('POST', '/@nfjs/dev/api/switchContext', { middleware: ['session', 'json'] } , async (context) => {
        try {
            sc.switchContext(context);
            context.send({ data: { success: true }});
        } catch(err) {
            context.send(err);
        }
    });

}

export {
    meta,
    init,
    menu
};
