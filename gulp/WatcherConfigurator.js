const GULP = require('gulp');
const JsBundleCompiler = require('./JsBundleCompiler');
const LogPrinter = require('./LogPrinter');


/**
 * Конфигуратор прослушивания изменений в файлах
 * @author blazer404
 * @url https://github.com/blazer404
 *
 * @arg {{
 *   sourceDir: string,
 *   outputDir: string
 * }} config Параметры:
 * - `sourceDir` - Путь до директории с исходниками
 * - `outputDir` - Путь до директории с результатами компиляции
 *
 * @example
 * const configurator = new WatcherConfigurator({
 *     sourceDir: `${AppConfig.SOURCE_DIR_JS}/site`,
 *     outputDir: `${AppConfig.OUTPUT_DIR_JS}/site`
 * });
 * configurator.watchJs();
 *
 * @see AppConfig
 */
class WatcherConfigurator {
    constructor(config = {}) {
        this.sourceDir = config.sourceDir;
        this.outputDir = config.outputDir;

        this.#exitOnInvalidConfig();
    }

    #exitOnInvalidConfig() {
        if (!this.sourceDir || !this.outputDir) {
            LogPrinter.danger('Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Конфигуратор прослушивания изменений в js-файлах
     */
    watchJsLegacy() {
        GULP.watch([`${this.sourceDir}/**/*.js`]).on('change', (filepath) => {
            this.#onChanged(filepath, true);
            this.#onStarted();
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceDir: this.sourceDir,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/js_legacy.config'),
                mainFilename: 'main',
                extension: 'js',
            });
            compiler.execute().then(() => this.#onCompiled());
        });
    }

    /**
     * Конфигуратор прослушивания изменений в js-файлах
     */
    watchJs() {
        GULP.watch([`${this.sourceDir}/**/*.js`]).on('change', (filepath) => {
            this.#onChanged(filepath, true);
            this.#onStarted();
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceDir: this.sourceDir,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/js.config.js'),
            });
            compiler.execute().then(() => this.#onCompiled());
        });
    }

    /**
     * Конфигуратор прослушивания изменений в vue-файлах
     */
    watchVue() {
        GULP.watch([`${this.sourceDir}/**/*.js`, `${this.sourceDir}/**/*.vue`]).on('change', (filepath) => {
            this.#onChanged(filepath, true);
            this.#onStarted();
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceDir: this.sourceDir,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/vue.config.js'),
            });
            compiler.execute().then(() => this.#onCompiled());
        });
    }

    /**
     * Конфигуратор прослушивания изменений в css-файлах
     */
    watchCss() {
        GULP.watch([`${this.sourceDir}/**/*.scss'`]).on('change', (filepath) => {
            this.#onChanged(filepath);
            // todo
        });
    }

    /**
     * Очистка консоли от предыдущих сообщений
     */
    #cleanLog() {
        process.stdout.write('\x1Bc');
    }

    /**
     * Событие при изменении файла
     * @param filepath
     * @param clearLog
     */
    #onChanged(filepath, clearLog = false) {
        clearLog
            ? this.#cleanLog()
            : LogPrinter.warning('====================================================');
        LogPrinter.message('', false);
        LogPrinter.warningHighlight(`Изменен файл: ${filepath}`, [filepath]);
    }

    /**
     * Событие при начале компиляции
     */
    #onStarted() {
        LogPrinter.message('', false);
        LogPrinter.success(`Компиляция начата`);
    }

    /**
     * Событие при успешной компиляции
     */
    #onCompiled() {
        LogPrinter.message('', false);
        LogPrinter.success(`Компиляция успешно завершена\n`)
    }
}

module.exports = WatcherConfigurator;