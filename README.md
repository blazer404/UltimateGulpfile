## Хуяк-сборка проекта (для настоящих падонков и аццких сотонайзеров)

---

## **Оглавление**

- [🚀 Запуск](#usage)
- [🛠️ Чё внутри?](#about)
- [🔄 Режимы сборки](#modes)
- [🔢 Версификация](#version)
- [📂 Создаём новый модуль](#create-module)
- [🎨 Кастомизация](#customization)
- [📝 Примеры работы](#examples)

---

## 🚀 **# Запуск: царь-батюшка командует**<span id="usage"></span>

```bash
  npm i  # Качаем все пакеты — сиди ровно!
```

```bash
  gulp  # Запускаем сервак и следим за файлухами (жми Ctrl+C, если надоело)
```

```bash
  gulp serve  # Только сервак (без слежки, для спокойных, как удав на героине)
```

```bash
  gulp watch  # Только слежка (сервак не мешает, красавчег?)
```

---

## 🛠️ **# Чё внутри? (спойлер: магия и баги)**<span id="about"></span>

1. `AppConfig` — Тут все настройки, как у бога за пазухой (пути, режимы, версии).
2. `Gulpfile` — Стартует сборку, следит за файлухами и дёргает BrowserSync.
3. `WatcherConfigurator` — Уши проэкта. Шпионит за файлами, как ФСБ на зарплате.
4. `JsBundleCompiler` — Крутит JS/Vue в бандлы:
    - Автоматом ищет `main.js` через Pathfinder (типа детектив).
    - Рекурсивно долбит вложенные модули.
    - Для прода жмёт в `.min.js` (байтики экономим, ага).
    - Цепляется к версификации через Version-класс.
5. `Version` — Автомат для версий:
    - Версия = `timestamp` (никаких плясок с бубном).
    - Формат: `?v=1620000000000` (чё, мало цифр?).
    - JS и CSS версионируются отдельно (йух, так можно было?!).
6. `Pathfinder` — Ищет, где файлы модулей спрятаны.
7. `LogPrinter` — Рисует в консоли радугу (ну почти).

---

## 🔄 **# Режимы сборки (чтобы не заскучать)**<span id="modes"></span>

- **`dev`** — файлы не жмутся (для тех кто любит читать код и плакать).
- **`prod`** — файлы сжаты в труху (для прода, где каждый килобайт на счету).

**Фишечки:**

- Режимы автоматом летят в конфиг.
- Имя файла = имя директухи (гениально, ёпт!).
- Для prod к имени файла лепится `.min` и включается минификация (как в мясорубке).

**Конфиги Webpack валятся тут:**

- `/webpack/js.config.js` — для нормалфагов.
- `/webpack/js_legacy.config.js` — для старых пердунов.
- `/webpack/vue.config.js` — для модных пидоров.

---

## 🔢 **# Версификация (чтобы кэш не кэшировал)**<span id="version"></span>

1. При каждой сборке версия = timestamp (никаких ручных правок).
2. Версии пишутся в PHP-классы типа так:
    ```php
    class CrmVersionHelper extends BaseVersionHelper {
        const JS = [
            'kanban' => YII_ENV_PROD ? '/web/js/crm/kanban.min.js?v=1620000000000' : '/web/js/crm/kanban.js?v=1620000000000',
        ];
    }
    ```

3. **Правила апдейта:**
    - Новый файл? Добавится в конец массива (без спросу).
    - Старый файл? Версия обновляется (а ты и не заметишь).
    - Внешние зависимости не трогаем (это не наш цирк).

---

## 📂 **# Создаём новый модуль (тыжпрограммист, лол)**<span id="create-module"></span>

### 🚩 **Шаг 1: Лепим папочки**

Создай директуху в `src` по типу:

- **JS**: `src/js/[твой_модуль]`
- **Vue**: `src/vue/[твой_модуль]`
- **Legacy JS**: `src/js_legacy/[твой_модуль]` (для дедов, которые всё ещё верят в jQuery)
- **CSS**: `src/css/[твой_модуль]`

### 🔄 **Шаг 2: Версификация (или как задротить в PHP)**

1. Слепи файлуху в `version/` типа такой — `[ТвойМодуль]VersionHelper.php`:
    ```php
    class [ТвойМодуль]VersionHelper extends BaseVersionHelper {
        const JS = [];   // ← тут будут твои урлы
        const CSS = [];  // ← а тут слезы
    }
    ```

2. Запили путь в `AppConfig`:
    ```javascript
    VERSION_FILES = {
        // ...
        [твой_модуль]: `${AppConfig.VERSION_PATH}/[ТвойМодуль]VersionHelper.php`
    };
    ```

### 👀 **Шаг 3: Слежка**

**Для JS:**

```javascript
new WatcherConfigurator({
    sourceDir: `${AppConfig.SOURCE_DIR_JS}/[твой_модуль]`,  // ← откуда тырим
    outputDir: `${AppConfig.OUTPUT_DIR_JS}/[твой_модуль]`   // ← куда пихаем
}).watchJs();
```

**Для Vue:**

```javascript
new WatcherConfigurator({
    sourceDir: `${AppConfig.SOURCE_DIR_VUE}/[твой_модуль]`,
    outputDir: `${AppConfig.OUTPUT_DIR_VUE}/[твой_модуль]`
}).watchVue();
```

**Для Legacy JS:**

```javascript
new WatcherConfigurator({
    sourceDir: `${AppConfig.SOURCE_DIR_JS_LEGACY}/[твой_модуль]`,
    outputDir: `${AppConfig.OUTPUT_DIR_JS}/[твой_модуль]`
}).watchJsLegacy();
```

**Для CSS/SCSS:**

```javascript
new WatcherConfigurator({
    sourceDir: `${AppConfig.SOURCE_DIR_CSS}/[твой_модуль]`,
    outputDir: `${AppConfig.OUTPUT_DIR_CSS}/[твой_модуль]`
}).watchCSS();
```

---

## 🎨 **# Кастомизация (для мазохистов и фанатов селф-харма)**<span id="customization"></span>

### 1. **Глобальные настройки в `AppConfig`**

Меняй чё хошь, но потом не ной:

```javascript
PROXY_DOMAIN = 'example.local';     // ← твой домен (меняй, сцуко!)
SOURCE_DIR_JS = 'src/js';           // ← откуда тырим файлы
OUTPUT_DIR_JS = 'web/js';           // ← куда сливаем бандлы
DEFAULT_JS_MAIN_FILENAME = 'main';  // ← имя точки входа (не нравится — меняй!)
DEFAULT_JS_EXTENSION = 'js';        // ← расширение (креативь!)
//остальное выясняй сам
```

### 2. **Новый конфиг через `WatcherConfigurator`**

- Создай нового смотрящего в `WatcherConfigurator.js`:
    ```javascript
    class WatcherConfigurator {
        //... 
        myCustomWatch() {
            GULP.watch([`${this.sourceDir}/**/*.js`]).on('change', (filepath) => {
                const compiler = new JsBundleCompiler({
                    // ... вшитые параметры
                    wpConfig: require('../webpack/my_custom.config'),  // ← твой уникальный конфиг
                    mainFilename: 'my_custom_app',                     // ← имя, как у рок-звезды
                    extension: 'jsx',                                  // ← моднявое расширение
                });
                compiler.execute();
            });
        }
    }
    ```

- Пропиши его в `gulpfile.js`:
    ```javascript
    GULP.task('watch', function () {
        //...
        new WatcherConfigurator({
            sourceDir: `${AppConfig.SOURCE_DIR_VUE}/crm`,
            outputDir: `${AppConfig.OUTPUT_DIR_VUE}/crm`
        }).myCustomWatch();
    });
    ```

### 3. **Смена паттерна версии (если ты особенный)**

Ковыряй `Version.js` (метод `#createVersionString()`):

```javascript
// Меняй тут, если хошь быть уникальным как снежинка ❄️
let versionString = `'${this.filename}' => YII_ENV_PROD ? '/${nameMin}' : '/${nameBig}',\r\n`;
```

---

## 📝 **# Примеры работы (для тех, кто не въехал)**<span id="examples"></span>

### 📂 **Модуль `blog`**

```  
src/js/blog/
    ├── post/
    │   ├── main.js      ← Точка входа
    │   └── helpers.js   ← Костыли (ну а как иначе?)
    ├── comments/
    │   ├── main.js
    │   └── api.js
    └── utils/
        └── calendar.js
```

### 📍 **Сценарий 1: Поменял `main.js`**

1. **Файлухо:** `src/js/blog/post/main.js`
2. **Чё происходит:**
    - Система видит изменение → компилит только `post/main.js` → лепит `web/js/blog/post.js`.
    - Версия в `BlogVersionHelper.php` апдейтится.

### 📍 **Сценарий 2: Поменял `helpers.js`**

1. **Файлухо:** `src/js/blog/post/helpers.js`
2. **Чё происходит:**
    - Система ищет `main.js` в `post/` → находит.
    - Компилит `post/main.js` → `web/js/blog/post.js`.
    - Версия меняется (ничего не поделаешь).

### 📍 **Сценарий 3: Поменял `calendar.js`**

1. **Файлухо:** `src/js/blog/utils/calendar.js`
2. **Чё происходит:**
    - Система ищет `main.js` в `utils/` → пусто.
    - Ползёт на уровень модуля `src/js/blog` и пытается вычислить `main.js` во вложенных директухах (только верхний
      уровень).
    - Находит `post/main.js` и `comments/main.js`.
    - Компилит оба → версии обновляются.
    - `calendar.js` остаётся не тронут (не повезло, дружочек).

---