/**
 * Конфигурация приложения
 * @author blazer404
 * @url https://github.com/blazer404
 *
 * @member PROXY_DOMAIN - домен для прослушивания `BROWSER_SYNC`
 * @member BROWSER_OPEN - автоматическое открытие браузера при запуске `BROWSER_SYNC`
 * @member SOURCE_DIR_JS - директория исходников `JS`
 * @member SOURCE_DIR_JS_LEGACY - директория исходников `JS-legacy`
 * @member SOURCE_DIR_VUE - директория исходников `Vue`
 * @member OUTPUT_DIR_JS - директория собранных `JS`-файлов
 * @member OUTPUT_DIR_VUE - директория собранных `Vue`-файлов
 * @member VERSION_PATH - корневая директория файлов `версификации`
 * @member VERSION_FILES - массив с `файлами версификации` для каждого модуля, формат: `{имя_модуля: путь_к_файлу}`
 * @member DEFAULT_JS_MAIN_FILENAME - имя основного `JS`-файла по умолчанию
 * @member DEFAULT_JS_EXTENSION - расширение основного `JS`-файла по умолчанию
 * @member DEFAULT_CSS_MAIN_FILENAME - имя основного `CSS`-файла по умолчанию
 * @member DEFAULT_CSS_EXTENSION - расширение основного `CSS`-файла по умолчанию
 * @member MODE - массив режимов сборки приложения: `dev`, `prod`
 */
class AppConfig {
    static PROXY_DOMAIN = 'site.local';
    static BROWSER_OPEN = false;

    static SOURCE_DIR_JS = 'src/js';
    static SOURCE_DIR_JS_LEGACY = 'src/js_legacy';
    static SOURCE_DIR_VUE = 'src/vue';
    static OUTPUT_DIR_JS = 'web/js';
    static OUTPUT_DIR_VUE = 'web/vue';


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