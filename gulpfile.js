const GULP = require("gulp");
const BROWSER_SYNC = require('browser-sync').create();
const WatcherConfigurator = require("./gulp/WatcherConfigurator");
const AppConfig = require("./gulp/AppConfig");


GULP.task('serve', () => BROWSER_SYNC.init({proxy: AppConfig.PROXY_DOMAIN, open: false}));

GULP.task('watch', function () {
    new WatcherConfigurator({sourceDir: `${AppConfig.JS_SOURCE_DIR}/site`, outputDir: `${AppConfig.JS_OUTPUT_DIR}/site`}).watchJs();
    new WatcherConfigurator({sourceDir: `${AppConfig.JS_SOURCE_DIR}/crm`, outputDir: `${AppConfig.JS_OUTPUT_DIR}/crm`}).watchJs();

    new WatcherConfigurator({sourceDir: `${AppConfig.JS_LEGACY_SOURCE_DIR}/site`, outputDir: `${AppConfig.JS_OUTPUT_DIR}/site`}).watchJsLegacy();
    new WatcherConfigurator({sourceDir: `${AppConfig.JS_LEGACY_SOURCE_DIR}/crm`, outputDir: `${AppConfig.JS_OUTPUT_DIR}/crm`}).watchJsLegacy();

    new WatcherConfigurator({sourceDir: `${AppConfig.VUE_SOURCE_DIR}/site`, outputDir: `${AppConfig.VUE_OUTPUT_DIR}/crm`}).watchVue();
    new WatcherConfigurator({sourceDir: `${AppConfig.VUE_SOURCE_DIR}/crm`, outputDir: `${AppConfig.VUE_OUTPUT_DIR}/crm`}).watchVue();
});

GULP.task('default', GULP.parallel('watch', 'serve'));
