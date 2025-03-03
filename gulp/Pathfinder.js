const PATH = require("path");
const LogPrinter = require("./LogPrinter");


/**
 * Класс для поиска корневого пути до модуля и имени модуля
 * @author blazer404
 * @url https://github.com/blazer404
 */
class Pathfinder {
    constructor(config = {}) {
        this.inputFilepath = config.inputFilepath;
        this.sourceDir = config.sourceDir;
        this.outputDir = config.outputDir;

        this.#exitOnInvalidConfig();
    }

    #exitOnInvalidConfig() {
        if (!this.inputFilepath || !this.sourceDir || !this.outputDir) {
            LogPrinter.danger('Ошибка инициализации класса! Параметры заданы неверно');
            process.exit(1);
        }
    }

    /**
     * Поиск корневого пути до модуля и имени модуля
     * @returns {{outputFilename: string, rootModuleDirName: string, rootPath: string}}
     */
    find() {
        const rootModuleDirName = this.#parseRootModuleDirName();
        LogPrinter.infoHighlight(`Имя родительской директории: ${rootModuleDirName}`, [rootModuleDirName]);
        const pathSegments = this.#parsePathSegments();
        const rootPathSegments = this.#findRootPathSegments(pathSegments, rootModuleDirName);
        const rootPath = PATH.resolve(rootPathSegments.join('/'));
        LogPrinter.infoHighlight(`Директория модуля: ${rootPath}`, [rootPath]);
        const outputFilename = PATH.basename(rootPath);
        LogPrinter.infoHighlight(`Имя модуля: ${outputFilename}`, [outputFilename]);
        return {rootModuleDirName, rootPath, outputFilename};
    }

    /**
     * Определение имени корневой директории модуля
     * @returns {string}
     */
    #parseRootModuleDirName() {
        let path = PATH.resolve(this.sourceDir);
        path = path.replace(/\\/g, '/');
        const segments = path.split('/');
        return segments[segments.length - 1];
    }

    /**
     * Определение сегментов пути файла
     * @returns {string[]}
     */
    #parsePathSegments() {
        let path = PATH.dirname(this.inputFilepath)
        path = path.replace(/\\/g, '\/');
        return path.split('/');
    }

    /**
     * Определение корневого пути до файла
     * @param pathSegments
     * @param rootDirName
     * @returns {*[]}
     */
    #findRootPathSegments(pathSegments, rootDirName) {
        let rootPathSegments = [];
        for (let i = 0; i < pathSegments.length; i++) {
            if (pathSegments[i] === rootDirName) {
                rootPathSegments = pathSegments.slice(0, i + 2);
                break;
            }
        }
        return rootPathSegments;
    }
}

module.exports = Pathfinder;