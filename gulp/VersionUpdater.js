const FS = require('fs');
const LogPrinter = require('./LogPrinter');


/**
 * Версификация файлов js/css в файле версификации
 * @author blazer404
 * @url https://github.com/blazer404
 */
class VersionUpdater {
    constructor(config = {}) {
        LogPrinter.success("\nVersionUpdater");
        this.dir = config.dir;
        this.filename = config.filename;
        this.versionFile = config.versionFile;
        this.ext = config.extension;

        this.versionFile = 'version/FileVersHelper.php' //todo определять файл по директории где лежит js/css

        this.#exitOnInvalidConfig();
    }

    #exitOnInvalidConfig() {
        if (!this.dir || !this.filename || !this.versionFile || !this.ext || !this.versionFile) {
            LogPrinter.danger('- Ошибка инициализации класса! Параметры заданы неверно\n\n');
            process.exit(1);
        }
    }

    /**
     * Обновление версии файла
     */
    update() {
        if (!this.#versionFileExists()) {
            LogPrinter.danger(`- Файл версификации "${this.versionFile}" не обнаружен`);
            return;
        }
        const path = `${this.dir}/${this.filename}`;
        LogPrinter.info(`- Обновляю версию файла "${path}.${this.ext}"`)

        FS.readFile(this.versionFile, (err, fileBuffer) => {
            if (err) {
                LogPrinter.danger('ERROR!: Ошибка чтения файла версификации');
                return;
            }
            if (fileBuffer.indexOf(`${path}.${this.ext}`) >= 0) {
                LogPrinter.info(`- Файл "${this.filename}.${this.ext}" уже есть в файле версификации`);
                //todo update version
                LogPrinter.info(`- Версия файла обновлена`);
            } else {
                this.#addNewToVersionFile(fileBuffer);
            }
        });
    }

    /**
     * Файл версификации существует
     * @returns {boolean}
     */
    #versionFileExists() {
        return FS.existsSync(this.versionFile);
    }

    /**
     * Добавление в версификацию нового файла
     * @param fileBuffer
     */
    #addNewToVersionFile(fileBuffer) {
        const template = this.#createVersionTemplate();
        const section = this.#findVersionFileSection();
        const lines = fileBuffer.toString().split('];');
        lines[section] += template;
        const content = lines.join('];');
        if (this.#writeVersionFile(content)) {
            LogPrinter.info(`- Файл "${this.filename}.${this.ext}" добавлен в файл версификации`);
            LogPrinter.info(`- Версия файла обновлена`);
        }
    }

    /**
     * Создание строки версификации
     * @returns {string}
     */
    #createVersionTemplate() {
        const version = (new Date()).getTime().toString();
        const path = `${this.dir}/${this.filename}`;
        const nameFileMin = `${path}.min.${this.ext}?v=${version}`;
        const nameFileNormal = `${path}.${this.ext}?v=${version}`;
        return `    '${this.filename}' => YII_ENV_PROD ? '/${nameFileMin}' : '/${nameFileNormal}',\r\n        `;
    }

    /**
     * Определение секции в файле версификации
     * @returns {number}
     */
    #findVersionFileSection() {
        return ['scss', 'css'].includes(this.ext) ? 1 : 0;
    }

    /**
     * Запись в файл версификации
     * @param fileContent
     * @returns {boolean}
     */
    #writeVersionFile(fileContent) {
        let hasError = false;
        FS.writeFile(this.versionFile, fileContent, (err) => {
            if (err) {
                LogPrinter.danger('ERROR!: Ошибка записи файла версификации');
                hasError = true;
                return;
            }
            FS.readFile(this.versionFile, (err) => {
                if (err) {
                    LogPrinter.danger('ERROR!: Ошибка чтения файла версификации после обновления версии');
                    hasError = true;
                }
            });
        });
        return !hasError;
    }
}

module.exports = VersionUpdater;