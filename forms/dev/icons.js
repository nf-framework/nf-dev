import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevIcons extends PlForm {
    static properties = {
        formTitle: {
            type: String,
            value: 'Иконки'
        },
        icons: {type: Array, value: ()=>[]}
    }

    static css = css`
        .icon {
            display: flex;
            flex-direction: column;
            border: 1px solid var(--grey-base);
            width: 130px;
            height: 130px;
            align-items: center;
            justify-content: center;
            gap: var(--space-md);
            border-radius: var(--border-radius);
        }
    `

    static template = html`
        <pl-flex-layout vertical fit scrollable>
            <pl-flex-layout d:repeat="[[icons]]" d:as="iconset" vertical>
                <h3>[[iconset.name]]</h3>
                <pl-flex-layout wrap>
                    <div class="icon" d:repeat="[[iconset.icons]]" d:as="icon">
                        <pl-icon-button iconset="[[iconset.name]]" size="16" icon="[[icon]]" on-click="[[onIconClick]]"></pl-icon-button>
                        [[icon]]
                    </div>
                </pl-flex-layout>
            </pl-flex-layout>
        </pl-flex-layout>
    `;

    onConnect() {
        let icsList = document.head.querySelectorAll('pl-iconset');
        let iconGroups = [];
        for(let ics of icsList) {
            let icList = ics.querySelectorAll('g');
            let icons = []
            for(let ic of icList) {
                icons.push(ic.id);
            }
            iconGroups.push({name: ics.iconset, icons});
        }
        this.icons = iconGroups;
    }

    onIconClick(event) {
        alert(`iconset="${event.currentTarget.iconset}" icon="${event.currentTarget.icon}"`);
    }
}
