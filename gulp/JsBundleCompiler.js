const WEBPACK = require('webpack-stream');
const GULP = require('gulp');
const PATH = require('path');
const FS = require('fs');
const LogPrinter = require('./LogPrinter');
const VersionUpdater = require('./VersionUpdater');


/**
 * Компилятор js-файлов
 * @author blazer404
 * @url https://github.com/blazer404
 */
class JsBundleCompiler {
    #fileExtension = 'js';
    #defaultFileName = `main.${this.#fileExtension}`;
    #defaultConfig = require('../webpack/js.config.js');

    #devMode = 'development';
    #prodMode = 'production';

    constructor(config = {}) {
        LogPrinter.success("\nJsBundleCompiler");
        this.inputFilepath = config.inputFilepath;
        this.sourceRoot = config.sourceRoot;
        this.outputDir = config.outputDir;
        this.mainJsFile = config.mainJsFile || this.#defaultFileName;
        this.wpConfig = config.wpConfig || this.#defaultConfig;

        this.#exitOnInvalidConfig()
    }

    #exitOnInvalidConfig() {
        if (!this.inputFilepath || !this.sourceRoot || !this.outputDir || !this.mainJsFile || !this.wpConfig) {
            LogPrinter.danger('- Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Запуск компиляции файлов
     */
    execute() {
        this.#init().then(response => this.#buildAll(response.rootPath, response.outputFilename));
    }

    /**
     * Инициализация параметров компиляции
     * @returns {Promise<unknown>}
     */
    async #init() {
        const rootModuleDirName = this.#parseRootModuleDirName();
        LogPrinter.info(`- Имя корневой директории модуля: "${rootModuleDirName}"`);
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
            LogPrinter.info(`- Компилирую "${srcFile}" в "${outputFilename}.${this.#fileExtension}"`);
            await this.#buildOne(this.#devMode, srcFile, outputFilename);
            await this.#buildOne(this.#prodMode, srcFile, outputFilename);
            await this.#upFileVersion(outputFilename);
        } else if (this.sourceRoot) {
            LogPrinter.warning('WARNING!: Похоже на внешний модуль.');
            LogPrinter.warning(`WARNING!: Произвожу компиляцию всех ${this.mainJsFile} в ${this.sourceRoot}`);
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
                LogPrinter.danger('ERROR!: Ошибка чтения директории');
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
                    compiler.execute();
                }
            }
        });
    }
}

module.exports = JsBundleCompiler;