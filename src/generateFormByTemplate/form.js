import { compiler } from '@nfjs/back';

export class DevGenerateForm {
    constructor() {}
    /**
     * Применение настроек формы к шаблону и возвращает текст готового
     * @param {string} template текст шаблона в формате
     * @returns {Promise<string>}
     */
    useTemplate(template) {
        const compilerArgs = this.prepareCompilerArgs();
        return compiler.compileText(template, compilerArgs);
    }
}