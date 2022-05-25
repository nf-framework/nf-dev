import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevSwitchContext extends PlForm {
    static get properties() {
        return {
            formTitle: { type: String, value: 'Смена контекста по конфигу' },
            ctxs: { value: () => ([]) },
            ctxName: {}
        }
    }

    static get template() {
        return html`
            <pl-flex-layout vertical>
                <pl-combobox label="Контекст" data="[[ctxs]]" value-property="name" text-property="name" value="{{ctxName}}"></pl-combobox>
                <pl-button label="Сменить контекст" variant="primary" on-click="[[onChangeContext]]" disabled="[[!ctxName]]"></pl-button>
            </pl-flex-layout>
            <pl-dataset id="getList" data="{{ctxs}}" endpoint="/@nfjs/dev/api/getContextList"></pl-dataset>
            <pl-action id="set" args="[[_compose('ctxName',ctxName)]]" endpoint="/@nfjs/dev/api/switchContext"></pl-action>
		`;
    }

    onConnect() {
        this.$.getList.execute();
    }

    async onChangeContext() {
        await this.$.set.execute();
        location.reload();
    }
}