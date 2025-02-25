/**
 * Вывод информации в консоль
 * @author blazer404
 * @url https://github.com/blazer404
 */
class LogPrinter {
    static colorBlue = '\x1b[34m';
    static colorYellow = '\x1b[33m';
    static colorGreen = '\x1b[32m';
    static colorRed = '\x1b[31m';
    static colorReset = '\x1b[0m';

    /**
     * Информационное сообщение
     * @param message
     */
    static info(message) {
        LogPrinter.#print(message, LogPrinter.colorBlue);
    }

    /**
     * Успешное сообщение
     * @param message
     */
    static success(message) {
        LogPrinter.#print(message, LogPrinter.colorGreen);
    }

    /**
     * Предупреждение
     * @param message
     */
    static warning(message) {
        LogPrinter.#print(message, LogPrinter.colorYellow);
    }

    /**
     * Ошибка
     * @param message
     */
    static danger(message) {
        LogPrinter.#print(message, LogPrinter.colorRed);
    }

    /**
     * Вывод сообщения в консоль с цветом
     * @param message
     * @param color
     */
    static #print(message, color) {
        console.log(`${color}${message}${LogPrinter.colorReset}`);
    }
}

module.exports = LogPrinter;