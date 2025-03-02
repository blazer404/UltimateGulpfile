const GULP = require("gulp");
const BROWSER_SYNC = require('browser-sync').create();
const WatcherConfigurator = require("./gulp/WatcherConfigurator");

const PROXY_DOMAIN = 'dp.local';


GULP.task('serve', () => BROWSER_SYNC.init({proxy: PROXY_DOMAIN, open: false}));

GULP.task('watch', function () {
    new WatcherConfigurator({sourceRoot: 'src/js/site', outputDir: 'output/js/site'}).watchJs();
    new WatcherConfigurator({sourceRoot: 'src/js/crm', outputDir: 'output/js/crm'}).watchJs();
    new WatcherConfigurator({sourceRoot: 'src/vue/crm', outputDir: 'output/vue/crm'}).watchVue();
    new WatcherConfigurator({sourceRoot: 'src/vue/site', outputDir: 'output/vue/crm'}).watchVue();
});

GULP.task('default', GULP.parallel('watch', 'serve'));
