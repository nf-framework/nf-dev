import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevIcons extends PlForm {
    static properties = {
        formTitle: {
            type: String,
            value: 'Иконки'
        }
    }

    static template = html`
        <pl-flex-layout fit>
            <pl-flex-layout vertical>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-up-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-down-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-left-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-right-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-up" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-down" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-left" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chevron-right" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="arrow-up" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="arrow-down" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="arrow-left" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="arrow-right" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="plus" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="plus-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="plus-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="plus-circle-filled" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="check" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="check-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="check-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="check-circle-filled" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="triangle-up" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="triangle-down" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="triangle-left" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="triangle-right" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="close" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="close-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="close-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="close-circle-filled" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="minus" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="minus-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="minus-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="minus-circle-filled" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-grid-icons" size="16" icon="sort" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-grid-icons" size="16" icon="sort-asc" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-grid-icons" size="16" icon="sort-desc" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-grid-icons" size="16" icon="filter" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="filter-s" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="filter" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="settings" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="settings-2" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="night" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="eye-opened" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="eye-closed" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="repeat" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="search" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="report" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chart-bar" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="chart-pie" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="person" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="person-group" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="profile" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="person-add" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="warning" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="warning-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="link" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="link-2" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="attachment" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="attachment-2" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="date" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="time" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="trashcan" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="home" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="datetime" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="more-horizontal" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="more-vertical" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="info-circle" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="database" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="file" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="print" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="save" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="download" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="layers" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="copy" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="paste" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="catalog" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="catalog-2" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="catalog-3" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="notifications" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="code" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="history" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="reload" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="upload" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="star" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="star-filled" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-icon-button iconset="pl-default" size="16" icon="send" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="mail" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-default" size="16" icon="logout" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="pdf" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="csv" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="xml" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="json" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="word" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="excel" on-click="[[onIconClick]]"></pl-icon-button>
                    <pl-icon-button iconset="pl-filetypes" size="16" icon="image" on-click="[[onIconClick]]"></pl-icon-button>
                </pl-flex-layout>
            </pl-flex-layout>
        </pl-flex-layout>
    `;

    onIconClick(event) {
        alert(`iconset="${event.currentTarget.iconset}" icon="${event.currentTarget.icon}"`);
    }
}