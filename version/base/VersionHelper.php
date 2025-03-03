<?php

namespace version\base;

abstract class VersionHelper
{
    protected const JS = [];
    protected const CSS = [];

    /**
     * Возвращает путь до файла с указанной версией в зависимости от окружения.
     *
     * Для `prod` возвращает `минифицированную` версию
     * <pre>
     * ENV_DEV: `/web/js/crm/script.js?v=1741021643616`
     * ENV_PROD: `/web/js/crm/script.min.js?v=1741021643616`
     * </pre>
     * @param string $nameWithExtension
     * @return string
     */
    abstract public static function getFilepath(string $nameWithExtension): string;

    /**
     * Поиск пути до указанного файла в массиве `JS` или `CSS`
     * @param string $nameWithExtension
     * @return string
     */
    abstract protected function findFilepathString(string $nameWithExtension): string;
}