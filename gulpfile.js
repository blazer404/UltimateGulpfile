const GULP = require("gulp");
const BROWSER_SYNC = require('browser-sync').create();
const WatcherConfigurator = require("./gulp/WatcherConfigurator");
const AppConfig = require("./gulp/AppConfig");


GULP.task('serve', () => BROWSER_SYNC.init({proxy: AppConfig.PROXY_DOMAIN, open: false}));

GULP.task('watch', function () {
    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_JS}/site`, outputDir: `${AppConfig.OUTPUT_DIR_JS}/site`}).watchJs();
    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_JS}/crm`, outputDir: `${AppConfig.OUTPUT_DIR_JS}/crm`}).watchJs();

    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_JS_LEGACY}/site`, outputDir: `${AppConfig.OUTPUT_DIR_JS}/site`}).watchJsLegacy();
    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_JS_LEGACY}/crm`, outputDir: `${AppConfig.OUTPUT_DIR_JS}/crm`}).watchJsLegacy();

    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_VUE}/site`, outputDir: `${AppConfig.OUTPUT_DIR_VUE}/crm`}).watchVue();
    new WatcherConfigurator({sourceDir: `${AppConfig.SOURCE_DIR_VUE}/crm`, outputDir: `${AppConfig.OUTPUT_DIR_VUE}/crm`}).watchVue();
});

GULP.task('default', GULP.parallel('watch', 'serve'));
