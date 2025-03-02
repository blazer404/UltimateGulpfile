const FS = require('fs');
const PATH = require("path");
const LogPrinter = require('./LogPrinter');


/**
 * Версификация js/css в файле версификации
 * @author blazer404
 * @url https://github.com/blazer404
 */
class Version {
    constructor(config = {}) {
        LogPrinter.message("\nVersion", false);
        this.versionFile = config.versionFile;
        this.fileDir = config.fileDir;
        this.filename = config.filename;
        this.extension = config.extension;
        this.#exitOnInvalidConfig();
    }

    #exitOnInvalidConfig() {
        if (!this.fileDir || !this.filename || !this.versionFile || !this.extension || !this.versionFile) {
            LogPrinter.danger('Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Обновление версии файла
     * @returns {Promise<void>}
     */
    async update() {
        const versionFileExists = await this.#versionFileExists();
        if (!versionFileExists) {
            LogPrinter.danger(`Файл версификации "${this.versionFile}" не обнаружен`);
            return;
        }
        const path = PATH.resolve(`${this.fileDir}/${this.filename}.${this.extension}`);
        if (!FS.existsSync(path)) {
            LogPrinter.danger(`Файл "${path}" не обнаружен. Версификация невозможна`);
            return;
        }
        const versionPath = PATH.resolve(this.versionFile);
        LogPrinter.infoHighlight(`Файл версификации: ${versionPath}`, [versionPath]);
        LogPrinter.infoHighlight(`Файл для версификации: ${path}`, [path]);
        try {
            const fileBuffer = await FS.promises.readFile(this.versionFile, 'utf8');
            await this.#addOrUpdate(fileBuffer);
            LogPrinter.info(`Версия файла обновлена`);
        } catch (err) {
            LogPrinter.danger('ERROR!: Ошибка чтения файла версификации');
        }
    }

    /**
     * Файл версификации существует
     * @returns {Promise<boolean>}
     */
    async #versionFileExists() {

        return await FS.promises.access(this.versionFile).then(() => true).catch(() => false);
    }

    /**
     * Добавление или обновление версии файла в файле версификации
     * @param fileBuffer
     * @returns {Promise<void>}
     */
    async #addOrUpdate(fileBuffer) {
        const targetStartIndex = fileBuffer.indexOf(`'${this.filename}'`);
        if (targetStartIndex === -1) {
            await this.#addVersion(fileBuffer);
        } else {
            await this.#updateVersion(fileBuffer, targetStartIndex);
        }
    }

    /**
     * Добавление в версификацию нового файла
     * @param fileBuffer
     * @returns {Promise<void>}
     */
    async #addVersion(fileBuffer) {
        const versionString = this.#createVersionString(true);
        const section = this.#findVersionSection();
        const lines = fileBuffer.toString().split('];');
        lines[section] += versionString;
        fileBuffer = lines.join('];');
        const written = await this.#writeVersionFile(fileBuffer);
        if (!written) {
            return;
        }
        const name = `${this.filename}.${this.extension}`;
        LogPrinter.infoHighlight(`Файл ${name} добавлен в файл версификации`, [name]);
    }

    /**
     * Обновление версии файла в файле версификации
     * @param fileBuffer
     * @param targetStartIndex
     * @returns {Promise<void>}
     */
    async #updateVersion(fileBuffer, targetStartIndex) {
        const versionString = this.#createVersionString();
        const targetEndIndex = fileBuffer.indexOf('\n', targetStartIndex) + 1;
        const targetString = fileBuffer.slice(targetStartIndex, targetEndIndex);
        fileBuffer = fileBuffer.replace(targetString, versionString);
        const written = await this.#writeVersionFile(fileBuffer);
        if (!written) {
            return;
        }
        const name = `${this.filename}.${this.extension}`;
        LogPrinter.infoHighlight(`Файл ${name} уже есть в файле версификации`, [name]);
    }

    /**
     * Создание строки версификации
     * @param appendSpaces
     * @returns {string}
     */
    #createVersionString(appendSpaces = false) {
        const version = (new Date()).getTime().toString();
        const fullName = `${this.fileDir}/${this.filename}`;
        const nameMin = `${fullName}.min.${this.extension}?v=${version}`;
        const nameBig = `${fullName}.${this.extension}?v=${version}`;
        let versionString = `'${this.filename}' => YII_ENV_PROD ? '/${nameMin}' : '/${nameBig}',\r\n`;
        if (appendSpaces) {
            versionString = `    ${versionString}        `;
        }
        LogPrinter.infoHighlight(`Новая версия: ${version}`, [version]);
        LogPrinter.infoHighlight(`Строка версификации: ${versionString}`, [versionString]);
        return versionString;
    }

    /**
     * Определение секции в файле версификации
     * @returns {number}
     */
    #findVersionSection() {
        return ['scss', 'css'].includes(this.extension) ? 1 : 0;
    }

    /**
     * Запись в файл версификации
     * @param fileContent
     * @returns {Promise<boolean>}
     */
    async #writeVersionFile(fileContent) {
        try {
            await FS.promises.writeFile(this.versionFile, fileContent);
            return true;
        } catch (err) {
            LogPrinter.danger('ERROR!: Ошибка записи файла версификации');
            return false;
        }
    }
}

module.exports = Version;