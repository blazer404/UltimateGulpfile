const GULP = require('gulp');
const JsBundleCompiler = require('./JsBundleCompiler');
const LogPrinter = require('./LogPrinter');


/**
 * Конфигуратор прослушивания изменений в файлах
 * @author blazer404
 * @url https://github.com/blazer404
 */
class WatcherConfigurator {
    constructor(config = {}) {
        this.sourceRoot = config.sourceRoot;
        this.outputDir = config.outputDir;

        this.#exitOnInvalidConfig();
    }

    #exitOnInvalidConfig() {
        if (!this.sourceRoot || !this.outputDir) {
            LogPrinter.danger('Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Конфигуратор прослушивания изменений в js-файлах
     */
    watchJs() {
        GULP.watch([`${this.sourceRoot}/**/*.js`]).on('change', (filepath) => {
            this.#onChanged(filepath, true);
            this.#onStarted();
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceRoot: this.sourceRoot,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/js.config.js'),
                mainFilename: 'main',
                extension: 'js',
            });
            compiler.execute().then(() => this.#onCompiled());
        });
    }

    /**
     * Конфигуратор прослушивания изменений в vue-файлах
     */
    watchVue() {
        GULP.watch([`${this.sourceRoot}/**/*.js`, `${this.sourceRoot}/**/*.vue`]).on('change', (filepath) => {
            this.#onChanged(filepath, true);
            this.#onStarted();
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceRoot: this.sourceRoot,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/vue.config.js'),
                mainFilename: 'app',
                extension: 'js'
            });
            compiler.execute().then(() => this.#onCompiled());
        });
    }

    /**
     * Конфигуратор прослушивания изменений в css-файлах
     */
    watchCss() {
        GULP.watch([`${this.sourceRoot}/**/*.scss'`]).on('change', (filepath) => {
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