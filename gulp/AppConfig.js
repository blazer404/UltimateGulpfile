/**
 * Конфигурация приложения
 * @author blazer404
 * @url https://github.com/blazer404
 */
class AppConfig {
    static PROXY_DOMAIN = 'dp.local';

    static JS_SOURCE_DIR = 'src/js';
    static JS_LEGACY_SOURCE_DIR = 'src/js_legacy';
    static VUE_SOURCE_DIR = 'src/vue';
    static JS_OUTPUT_DIR = 'web/js';
    static VUE_OUTPUT_DIR = 'web/vue';


    static VERSION_PATH = 'version';
    static VERSION_FILES = {
        crm: `${AppConfig.VERSION_PATH}/CrmVersionHelper.php`,
        site: `${AppConfig.VERSION_PATH}/SiteVersionHelper.php`
    };

    static DEFAULT_JS_MAIN_FILENAME = 'main';
    static DEFAULT_JS_EXTENSION = 'js';

    static DEFAULT_CSS_MAIN_FILENAME = 'main';
    static DEFAULT_CSS_EXTENSION = 'css';

    static MODE = {
        dev: 'development',
        prod: 'production'
    };
}

module.exports = AppConfig;