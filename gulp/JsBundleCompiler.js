const WEBPACK = require('webpack-stream');
const GULP = require('gulp');
const PATH = require('path');
const FS = require('fs');
const Pathfinder = require("./Pathfinder");
const Version = require('./Version');
const LogPrinter = require('./LogPrinter');
const AppConfig = require('./AppConfig');


/**
 * Компилятор js-файлов
 * @author blazer404
 * @url https://github.com/blazer404
 */
class JsBundleCompiler {
    constructor(config = {}) {
        LogPrinter.message("\nJsBundleCompiler", false);
        this.rootModuleDirName = '';
        this.inputFilepath = config.inputFilepath;
        this.sourceDir = config.sourceDir;
        this.outputDir = config.outputDir;
        this.wpConfig = config.wpConfig;
        this.mainFilename = config.mainFilename || AppConfig.defaultJsMainFilename;
        this.extension = config.extension || AppConfig.defaultJsExtension;

        this.#exitOnInvalidConfig()
    }

    #exitOnInvalidConfig() {
        if (!this.inputFilepath || !this.sourceDir || !this.outputDir || !this.wpConfig || !this.mainFilename || !this.extension) {
            LogPrinter.danger('Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Запуск компиляции файлов
     * @returns {Promise<void>}
     */
    async execute() {
        const pathfinder = new Pathfinder({
            inputFilepath: this.inputFilepath,
            sourceDir: this.sourceDir,
            outputDir: this.outputDir
        });
        const pathSettings = pathfinder.find();
        this.rootModuleDirName = pathSettings.rootModuleDirName;
        await this.#buildAll(pathSettings.rootPath, pathSettings.outputFilename);
    }

    /**
     * Компиляция, углификация и версификация файлов
     * @param rootPath
     * @param outputFilename
     * @returns {Promise<void>}
     */
    async #buildAll(rootPath, outputFilename) {
        const srcFile = PATH.resolve(`${rootPath}/${this.mainFilename}.${this.extension}`);
        if (FS.existsSync(srcFile)) {
            const name = `${outputFilename}.${this.extension}`;
            LogPrinter.infoHighlight(`Компилирую ${srcFile} в ${name}`, [srcFile, name]);
            await this.#buildOne(AppConfig.mode.dev, srcFile, outputFilename);
            await this.#buildOne(AppConfig.mode.prod, srcFile, outputFilename);
            LogPrinter.infoHighlight(`Компиляция ${name} успешно завершена`, [name]);
            await this.#upFileVersion(outputFilename);
        } else if (this.sourceDir) {
            LogPrinter.warning('WARNING!: Похоже на внешний модуль.');
            LogPrinter.warning(`WARNING!: Произвожу компиляцию всех "${this.mainFilename}.${this.extension}" в "${this.sourceDir}"`);
            await this.#rebuildRecursive();
        }
    }

    /**
     * Компиляция файла в зависимости от режима сборки
     * @param mode
     * @param srcFile
     * @param outputFilename
     * @returns {Promise<unknown>}
     */
    async #buildOne(mode, srcFile, outputFilename) {
        this.wpConfig.mode = mode;
        this.wpConfig.entry.main = srcFile;
        const extension = mode === AppConfig.mode.dev ? `${this.extension}` : `min.${this.extension}`;
        this.wpConfig.output.filename = `${outputFilename}.${extension}`;
        this.wpConfig.output.path = PATH.resolve(`/${this.outputDir}`);
        return new Promise(async resolve => {
            await GULP.src(srcFile)
                .pipe(WEBPACK(this.wpConfig))
                .on('error', async function handleError() {
                    await this.emit('end');
                    LogPrinter.danger(`\nКомпиляция "${srcFile}" завершена с ошибками\n`);
                })
                .pipe(GULP.dest(this.outputDir))
                .on('end', resolve);
        });
    }

    /**
     * Обновление версии в ассетах
     * @param filename
     * @returns {Promise<void>}
     */
    async #upFileVersion(filename) {
        const version = new Version({
            fileDir: this.outputDir,
            filename: filename,
            extension: this.extension,
            versionFile: AppConfig.versionFiles[this.rootModuleDirName] || ''
        });
        await version.update();
    }

    /**
     * Рекурсивная компиляция всех бандлов, если был изменен какой-либо внешний модуль
     * @returns {Promise<void>}
     */
    async #rebuildRecursive() {
        const sourceRootPath = PATH.resolve(this.sourceDir);
        try {
            const files = await FS.promises.readdir(sourceRootPath);
            for (const file of files) {
                const filePath = PATH.join(sourceRootPath, file);
                const inputFilepath = PATH.resolve(`${filePath}/${this.mainFilename}.${this.extension}`);
                const fileExists = FS.existsSync(inputFilepath);
                if (fileExists) {
                    const compiler = new JsBundleCompiler({...this, inputFilepath: inputFilepath});
                    await compiler.execute();
                }
            }
        } catch (err) {
            LogPrinter.danger('ERROR!: Ошибка чтения директории');
        }
    }
}

module.exports = JsBundleCompiler;