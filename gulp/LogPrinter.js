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
    static colorGray = '\x1b[90m';

    /**
     * Обычное сообщение
     * @param message
     * @param appendTime
     */
    static message(message, appendTime = true) {
        LogPrinter.#print(message, '', appendTime);
    }

    /**
     * Информационное сообщение
     * @param message
     * @param appendTime
     */
    static info(message, appendTime = true) {
        LogPrinter.#print(message, LogPrinter.colorBlue, appendTime);
    }

    /**
     * Успешное сообщение
     * @param message
     * @param appendTime
     */
    static success(message, appendTime = true) {
        LogPrinter.#print(message, LogPrinter.colorGreen, appendTime);
    }

    /**
     * Предупреждение
     * @param message
     * @param appendTime
     */
    static warning(message, appendTime = true) {
        LogPrinter.#print(message, LogPrinter.colorYellow, appendTime);
    }

    /**
     * Ошибка
     * @param message
     * @param appendTime
     */
    static danger(message, appendTime = true) {
        LogPrinter.#print(message, LogPrinter.colorRed, appendTime);
    }


    /**
     * Подсветка информационного сообщения
     * @param message
     * @param highlight
     * @param appendTime
     */
    static infoHighlight(message, highlight = [], appendTime = true) {
        LogPrinter.#printHighlight(message, highlight, LogPrinter.colorBlue, appendTime);
    }

    /**
     * Подсветка успешного сообщения
     * @param message
     * @param highlight
     * @param appendTime
     */
    static successHighlight(message, highlight = [], appendTime = true) {
        LogPrinter.#printHighlight(message, highlight, LogPrinter.colorGreen, appendTime);
    }

    /**
     * Подсветка предупреждения
     * @param message
     * @param highlight
     * @param appendTime
     */
    static warningHighlight(message, highlight = [], appendTime = true) {
        LogPrinter.#printHighlight(message, highlight, LogPrinter.colorYellow, appendTime);
    }

    /**
     * Подсветка ошибки
     * @param message
     * @param highlight
     * @param appendTime
     */
    static dangerHighlight(message, highlight = [], appendTime = true) {
        LogPrinter.#printHighlight(message, highlight, LogPrinter.colorRed, appendTime);
    }


    /**
     * Вывод сообщения в консоль с цветом
     * @param message
     * @param color
     * @param appendTime
     */
    static #print(message, color = '', appendTime = true) {
        let time = '';
        if (appendTime) {
            time = LogPrinter.#generateTime();
        }
        message = `${color}${message}${LogPrinter.colorReset}`;
        console.log(`${time} ${message}`);
    }

    /**
     * Вывод сообщения в консоль с подсветкой указанных слов цветом
     * @param message
     * @param highlight
     * @param color
     * @param appendTime
     */
    static #printHighlight(message, highlight = [], color = '', appendTime = true) {
        let time = '';
        if (appendTime) {
            time = LogPrinter.#generateTime();
        }
        if (highlight.length > 0 && color) {
            highlight.forEach(pattern => {
                pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                pattern = pattern.replace(/\r\n$/, '');
                const regex = new RegExp(pattern, 'g');
                message = message.replace(regex, `${color}$&${LogPrinter.colorReset}`);
                message = message.trim();
            });
        }
        console.log(`${time} ${message}`);
    }

    /**
     * Генерация времени лога в формате [HH:MM:SS]
     * @returns {string}
     */
    static #generateTime() {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `[${LogPrinter.colorGray}${hours}:${minutes}:${seconds}${LogPrinter.colorReset}]`;
    }
}

module.exports = LogPrinter;