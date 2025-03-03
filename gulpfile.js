const GULP = require("gulp");
const BROWSER_SYNC = require('browser-sync').create();
const WatcherConfigurator = require("./gulp/WatcherConfigurator");

const PROXY_DOMAIN = 'dp.local';

const JS_SRC_DIR = 'src/js';
const JS_LEGACY_SRC_DIR = 'src/js_legacy';
const VUE_SRC_DIR = 'src/vue';
const JS_OUTPUT_DIR = 'web/js';
const VUE_OUTPUT_DIR = 'web/vue';


GULP.task('serve', () => BROWSER_SYNC.init({proxy: PROXY_DOMAIN, open: false}));

GULP.task('watch', function () {
    new WatcherConfigurator({sourceDir: `${JS_SRC_DIR}/site`, outputDir: `${JS_OUTPUT_DIR}/site`}).watchJs();
    new WatcherConfigurator({sourceDir: `${JS_SRC_DIR}/crm`, outputDir: `${JS_OUTPUT_DIR}/crm`}).watchJs();

    new WatcherConfigurator({sourceDir: `${JS_LEGACY_SRC_DIR}/site`, outputDir: `${JS_OUTPUT_DIR}/site`}).watchJsLegacy();
    new WatcherConfigurator({sourceDir: `${JS_LEGACY_SRC_DIR}/crm`, outputDir: `${JS_OUTPUT_DIR}/crm`}).watchJsLegacy();

    new WatcherConfigurator({sourceDir: `${VUE_SRC_DIR}/site`, outputDir: `${VUE_OUTPUT_DIR}/crm`}).watchVue();
    new WatcherConfigurator({sourceDir: `${VUE_SRC_DIR}/crm`, outputDir: `${VUE_OUTPUT_DIR}/crm`}).watchVue();
});

GULP.task('default', GULP.parallel('watch', 'serve'));
