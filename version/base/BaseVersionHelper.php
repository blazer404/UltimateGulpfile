<?php

namespace version\base;

use Exception;

class BaseVersionHelper extends VersionHelper
{
    protected const JS = [];
    protected const CSS = [];


    /**
     * @inheritDoc
     * @param string $nameWithExtension
     * @return string
     * @throws Exception
     */
    public static function getFilepath(string $nameWithExtension): string
    {
        return (new static())->findFilepathString($nameWithExtension);
    }

    /**
     * @inheritDoc
     * @param string $nameWithExtension
     * @return string
     * @throws Exception
     */
    protected function findFilepathString(string $nameWithExtension): string
    {
        $filenameChunks = explode('.', $nameWithExtension);
        if (count($filenameChunks) < 2) {
            throw new Exception('Необходимо указать расширение файла');
        }
        $fileExtension = array_pop($filenameChunks);
        $fileName = implode('.', $filenameChunks);
        if (!$fileName) {
            throw new Exception('Имя файла не может быть пустым');
        }
        $constName = mb_strtoupper($fileExtension);
        if (!defined("static::$constName")) {
            throw new Exception("Неверное расширение: $fileExtension");
        }
        $scriptsMap = constant('static::' . $constName);
        if (!$scriptsMap[$fileName]) {
            throw new Exception("Файл '$fileName' не найден в списке $constName");
        }
        return (string)$scriptsMap[$fileName];
    }
}