const GULP = require('gulp');
const JsBundleCompiler = require('./JsBundleCompiler');
const LogPrinter = require('./LogPrinter');
const gulp = require("gulp");

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
            LogPrinter.danger('- Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    watchJs() {
        GULP.watch([`${this.sourceRoot}/**/*.js`]).on('change', (filepath) => {
            this.#printOnChanged(filepath);
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceRoot: this.sourceRoot,
                outputDir: this.outputDir
            });
            compiler.execute();
        });
    }

    watchVue() {
        GULP.watch([`${this.sourceRoot}/**/*.js`, `${this.sourceRoot}/**/*.vue`]).on('change', (filepath) => {
            this.#printOnChanged(filepath);
            const compiler = new JsBundleCompiler({
                inputFilepath: filepath,
                sourceRoot: this.sourceRoot,
                outputDir: this.outputDir,
                wpConfig: require('../webpack/vue.config.js')
            });
            compiler.execute();
        });
    }

    watchCss() {
        GULP.watch([`${this.sourceRoot}/**/*.scss'`]).on('change', (filepath) => {
            this.#printOnChanged(filepath);
            // todo
        });
    }

    #printOnChanged(filepath) {
        LogPrinter.warning('====================================================');
        LogPrinter.warning(`Изменен файл: ${filepath}`);
    }
}

module.exports = WatcherConfigurator;