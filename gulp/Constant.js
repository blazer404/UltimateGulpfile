const versionFilesPath = 'version';

const versionFiles = {
    crm: `${versionFilesPath}/CrmVersionHelper.php`,
    site: `${versionFilesPath}/SiteVersionHelper.php`
};

const defaultJsMainFilename = 'main';
const defaultJsExtension = 'js';

const defaultCssMainFilename = 'main';
const defaultCssExtension = 'css';

const mode = {
    dev: 'development',
    prod: 'production'
};

module.exports = {
    versionFiles,
    defaultJsMainFilename,
    defaultJsExtension,
    defaultCssMainFilename,
    defaultCssExtension,
    mode
}
