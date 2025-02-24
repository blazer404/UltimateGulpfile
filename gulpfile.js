const WEBPACK = require('webpack-stream');
const GULP = require('gulp');
const BROWSER_SYNC = require('browser-sync').create();
const SAAS = require('gulp-sass');
const autoprefixer = import('gulp-autoprefixer');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const debug = import('gulp-debug');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
const del = import('del');
const ARGS = require('yargs').argv;
const PATH = require('path');
const FS = require('fs');
const replace = import('replace-in-file');
const gulpif = require('gulp-if');


SAAS.compiler = require('sass');

const VERSION_FILES = {
    site: 'version/SiteVersion.php',
    crm: 'version/CrmVersion.php'
};


const PROXY_DOMAIN = 'dp.local';

GULP.task('watch', function () {
    new WatcherConfigurator({sourceRoot: 'src/js/site', outputDir: 'output/js/site'}).watchJs();
    new WatcherConfigurator({sourceRoot: 'src/js/crm', outputDir: 'output/js/crm'}).watchJs();
});
GULP.task('serve', () => BROWSER_SYNC.init({proxy: PROXY_DOMAIN, open: false}));
GULP.task('default', GULP.parallel('watch', 'serve'));


/**
 * Конфигурация наблюдателей
 */
class WatcherConfigurator {
    constructor(config) {
        this.sourceRoot = config.sourceRoot;
        this.outputDir = config.outputDir;
    }

    watchJs() {
        GULP.watch([`${this.sourceRoot}/**/*.js`]).on('change', (filepath) => {
            this.#printOnChanged(filepath);
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceRoot: this.sourceRoot,
                outputDir: this.outputDir
            });
            compiler.start();
        });
    }

    watchCss() {
        GULP.watch([`${this.sourceRoot}/**/*.scss'`]).on('change', (filepath) => {
            this.#printOnChanged(filepath);
            // todo
        });
    }

    #printOnChanged(filepath) {
        logPrinter.warning('====================================================');
        logPrinter.warning(`Изменен файл: ${filepath}`);
    }
}

/**
 * Компиляция js-файлов в бандл
 */
class JsBundleCompiler {
    #fileExtension = 'js';
    #defaultFileName = `main.${this.#fileExtension}`;
    #defaultConfig = require('./webpack/js.config.js');

    #devMode = 'development';
    #prodMode = 'production';

    constructor(config = {}) {
        logPrinter.success("\nJsBundleCompiler");
        this.inputFilepath = config.inputFilepath;
        this.sourceRoot = config.sourceRoot;
        this.outputDir = config.outputDir;
        this.mainJsFile = config.mainJsFile || this.#defaultFileName;
        this.wpConfig = config.webpack || this.#defaultConfig;
    }

    /**
     * Запуск компиляции файлов
     */
    start() {
        if (!this.inputFilepath || !this.outputDir || !this.mainJsFile || !this.wpConfig) {
            throw new Error('Ошибка инициализации класса! Параметры заданы неверно');
        }
        this.#init().then(response => this.#buildAll(response.rootPath, response.outputFilename));
    }

    /**
     * Инициализация параметров компиляции
     * @returns {Promise<unknown>}
     */
    async #init() {
        const rootModuleDirName = this.#parseRootModuleDirName();
        logPrinter.info(`- Имя корневой директории модуля: "${rootModuleDirName}"`);
        const pathSegments = this.#parsePathSegments();
        const rootPathSegments = this.#findRootPathSegments(pathSegments, rootModuleDirName);
        const rootPath = PATH.resolve(rootPathSegments.join('/'));
        const outputFilename = PATH.basename(rootPath);
        return new Promise(resolve => resolve({rootPath, outputFilename}));
    }

    /**
     * Определение имени корневой директории модуля
     * @returns {string}
     */
    #parseRootModuleDirName() {
        let path = PATH.resolve(this.sourceRoot);
        path = path.replace(/\\/g, '/');
        const segments = path.split('/');
        return segments[segments.length - 1];
    }

    /**
     * Определение сегментов пути файла
     * @returns {*}
     */
    #parsePathSegments() {
        let path = PATH.dirname(this.inputFilepath)
        path = path.replace(/\\/g, '\/');
        return path.split('/');
    }

    /**
     * Определение корневого пути до файла
     * @param pathSegments
     * @param rootDirName
     * @returns {*[]}
     */
    #findRootPathSegments(pathSegments, rootDirName) {
        let rootPathSegments = [];
        for (let i = 0; i < pathSegments.length; i++) {
            if (pathSegments[i] === rootDirName) {
                rootPathSegments = pathSegments.slice(0, i + 2);
                break;
            }
        }
        return rootPathSegments;
    }


    /**
     * Компиляция, углификация и версификация файлов
     * @returns {*}
     */
    async #buildAll(rootPath, outputFilename) {
        const srcFile = PATH.resolve(`${rootPath}/${this.mainJsFile}`);
        if (FS.existsSync(srcFile)) {
            logPrinter.info(`- Компилирую "${srcFile}" в "${outputFilename}.${this.#fileExtension}"`);
            await this.#buildOne(this.#devMode, srcFile, outputFilename);
            await this.#buildOne(this.#prodMode, srcFile, outputFilename);
            await this.#upFileVersion(outputFilename);
        } else if (this.sourceRoot) {
            logPrinter.warning('WARNING!: Похоже на внешний модуль.');
            logPrinter.warning(`WARNING!: Произвожу компиляцию всех ${this.mainJsFile} в ${this.sourceRoot}`);
            await this.#rebuildRecursive();
        }
    }

    /**
     * Компиляция файла в зависимости от режима сборки
     * @param mode this.#devMode/this.#prodMode
     * @param srcFile путь основному файлу сборки
     * @param outputFilename имя выходного файла
     * @returns {Promise<unknown>}
     */
    async #buildOne(mode = this.#devMode, srcFile, outputFilename) {
        this.wpConfig.mode = mode;
        this.wpConfig.entry.main = srcFile;
        const extension = mode === this.#devMode ? `${this.#fileExtension}` : `min.${this.#fileExtension}`;
        this.wpConfig.output.filename = `${outputFilename}.${extension}`;
        this.wpConfig.output.path = PATH.resolve(`/${this.outputDir}`);

        return new Promise(resolve => {
            GULP.src(srcFile)
                .pipe(WEBPACK(this.wpConfig))
                .on('error', function handleError() {
                    this.emit('end');
                })
                .pipe(GULP.dest(this.outputDir))
                .on('end', resolve);
        });
    }

    /**
     * Обновление версии в ассетах
     * @param filename
     * @returns {Promise<unknown>}
     */
    async #upFileVersion(filename) {
        const updater = new VersionUpdater({
            dir: this.outputDir,
            filename: filename,
            extension: 'js'
        });
        return await new Promise(() => updater.update());
    }

    /**
     * Рекурсивная компиляция всех бандлов, если был изменен какой-либо внешний модуль
     */
    #rebuildRecursive() {
        const sourceRootPath = PATH.resolve(this.sourceRoot);
        FS.readdir(sourceRootPath, (err, files) => {
            if (err) {
                logPrinter.danger('ERROR!: Ошибка чтения директории');
                return;
            }
            for (const file of files) {
                const filePath = PATH.join(sourceRootPath, file);
                const inputFilepath = PATH.resolve(`${filePath}/${this.mainJsFile}`);
                if (FS.existsSync(inputFilepath)) {
                    const compiler = new JsBundleCompiler({
                        inputFilepath: inputFilepath,
                        outputDir: this.outputDir,
                        sourceRoot: this.sourceRoot
                    });
                    compiler.start();
                }
            }
        });
    }
}

/**
 * Версификация файлов
 */
class VersionUpdater {
    constructor(config) {
        logPrinter.success("\nVersionUpdater");
        this.dir = config.dir;
        this.filename = config.filename;
        this.versionFile = config.versionFile;
        this.extension = config.extension;

        this.versionFile = 'version/FileVersHelper.php' //todo определять файл по директории где лежит js/css
    }

    /**
     * Обновление версии файла
     */
    update() {
        if (!this.#versionFileExists()) {
            logPrinter.danger(`- Файл версификации "${this.versionFile}" не обнаружен`);
            return;
        }
        const path = `${this.dir}/${this.filename}`;
        logPrinter.info(`- Обновляю версию файла "${path}.${this.extension}"`)

        FS.readFile(this.versionFile, (err, fileBuffer) => {
            if (err) {
                logPrinter.danger('ERROR!: Ошибка чтения файла версификации');
                return;
            }
            if (fileBuffer.indexOf(`${path}.${this.extension}`) >= 0) {
                logPrinter.info(`- Файл "${this.filename}.${this.extension}" уже есть в файле версификации`);
                //todo update version
                logPrinter.info(`- Версия файла обновлена`);
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
            logPrinter.info(`- Файл "${this.filename}.${this.extension}" добавлен в файл версификации`);
            logPrinter.info(`- Версия файла обновлена`);
        }
    }

    /**
     * Создание строки версификации
     * @returns {string}
     */
    #createVersionTemplate() {
        const version = (new Date()).getTime().toString();
        const path = `${this.dir}/${this.filename}`;
        const nameFileMin = `${path}.min.${this.extension}?v=${version}`;
        const nameFileNormal = `${path}.${this.extension}?v=${version}`;
        return `    '${this.filename}' => YII_ENV_PROD ? '/${nameFileMin}' : '/${nameFileNormal}',\r\n        `;
    }

    /**
     * Определение секции в файле версификации
     * @returns {number}
     */
    #findVersionFileSection() {
        return ['scss', 'css'].includes(this.extension) ? 1 : 0;
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
                logPrinter.danger('ERROR!: Ошибка записи файла версификации');
                hasError = true;
                return;
            }
            FS.readFile(this.versionFile, (err) => {
                if (err) {
                    logPrinter.danger('ERROR!: Ошибка чтения файла версификации после обновления версии');
                    hasError = true;
                }
            });
        });
        return !hasError;
    }
}

/**
 * Логгер
 */
class logPrinter {
    static colorBlue = '\x1b[34m';
    static colorYellow = '\x1b[33m';
    static colorGreen = '\x1b[32m';
    static colorRed = '\x1b[31m';
    static colorReset = '\x1b[0m';

    static info(message) {
        logPrinter.print(message, logPrinter.colorBlue);
    }

    static success(message) {
        logPrinter.print(message, logPrinter.colorGreen);
    }

    static warning(message) {
        logPrinter.print(message, logPrinter.colorYellow);
    }

    static danger(message) {
        logPrinter.print(message, logPrinter.colorRed);
    }

    static print(message, color) {
        console.log(`${color}${message}${logPrinter.colorReset}`);
    }
}
