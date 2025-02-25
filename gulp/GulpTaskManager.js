const GULP = require("gulp");
const BROWSER_SYNC = require('browser-sync').create();
const WatcherConfigurator = require("./WatcherConfigurator");

/**
 * Управление заданиями Gulp
 * @author blazer404
 * @url https://github.com/blazer404
 */
class GulpTaskManager {
    #initWatch() {
        GULP.task('watch', function () {
            new WatcherConfigurator({sourceRoot: 'src/js/site', outputDir: 'output/js/site'}).watchJs();
            new WatcherConfigurator({sourceRoot: 'src/js/crm', outputDir: 'output/js/crm'}).watchJs();
            new WatcherConfigurator({sourceRoot: 'src/vue/crm', outputDir: 'output/vue/crm'}).watchVue();
            new WatcherConfigurator({sourceRoot: 'src/vue/site', outputDir: 'output/vue/crm'}).watchVue();
        });
    }

    #initServe() {
        const PROXY_DOMAIN = 'dp.local';
        GULP.task('serve', () => BROWSER_SYNC.init({proxy: PROXY_DOMAIN, open: false}));
    }

    #initDefault() {
        GULP.task('default', GULP.parallel('watch', 'serve'));
    }

    #initAll() {
        this.#initWatch();
        this.#initServe();
        this.#initDefault(); // это задание всегда должно быть последним!
    }

    /**
     * Запуск заданий Gulp
     */
    static listen() {
        (new this()).#initAll();
    }
}

module.exports = GulpTaskManager;