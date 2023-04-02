import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class DevDataTools extends PlForm {
    static properties = {
        formTitle: {
            type: String,
            value: 'Манипуляции с данными'
        },
        csv: { value: () => ({}) }
    }

    static template = html`
        <pl-tabpanel>
            <pl-tab header="csv">
                <pl-flex-layout>
                    <pl-input value="{{csv.delimiter}}"></pl-input>
                    <pl-button label="toValues" on-click="[[csvToValues]]"></pl-button>
                </pl-flex-layout>
                <pl-flex-layout fit>
                    <pl-textarea value="{{csv.input}}" fit></pl-textarea>
                    <pl-textarea value="{{csv.output}}" fit></pl-textarea>
                </pl-flex-layout>
            </pl-tab>
        </pl-tabpanel>
    `;

    onConnect() {
    }

    csvParse(csvString, delimiterString){
        const delimiter = delimiterString || ',';
        const exp = new RegExp(`(\\${delimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${delimiter}\\r\\n]*))`,'gi');
        const result = [[]];
        let match = null
        while ((match = exp.exec(csvString))) {
            let matchedDelimiter = match[1]
            if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
                result.push([])
            }
            let matchedValue
            if (match[2]) {
                matchedValue = match[2].replace(new RegExp('""', 'g'), '"');
            } else {
                matchedValue = match[3];
            }
            result[result.length - 1].push(matchedValue)
        }
        return result
    }

    csvToValues() {
        const output = this.csvParse(this.csv.input, this.csv.delimiter);
        const header = output.shift();
        const values = output.map(row => `(${row.map(f => `'${f.replace("'","''")}'`).join(',')})`).join(',\r\n');
        const res = `select * from (values \r\n${values}\r\n) as t (${header.join(',')})`;
        this.set('csv.output', res);
    }
}
