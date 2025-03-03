class AppConfig {
    static versionPath = 'version';

    static versionFiles = {
        crm: `${AppConfig.versionPath}/CrmVersionHelper.php`,
        site: `${AppConfig.versionPath}/SiteVersionHelper.php`
    };

    static defaultJsMainFilename = 'main';
    static defaultJsExtension = 'js';

    static defaultCssMainFilename = 'main';
    static defaultCssExtension = 'css';

    static mode = {
        dev: 'development',
        prod: 'production'
    };
}

module.exports = AppConfig;