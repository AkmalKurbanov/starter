let preprocessor = "sass"; // Preprocessor (sass)

import pkg from "gulp";
const { src, dest, parallel, series, watch } = pkg;

import Fs from "fs";
import browserSync from "browser-sync";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import sassglob from "gulp-sass-glob";
const sass = gulpSass(dartSass);
import postCss from "gulp-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import imagemin from "gulp-imagemin";
import imageminWebp from "imagemin-webp";
import imageminSvgo from "imagemin-svgo";
import imageminOptipng from "imagemin-optipng";
import changed from "gulp-changed";
import concat from "gulp-concat";
import rsync from "gulp-rsync";
import { deleteAsync } from "del";
import pug from "gulp-pug";
import ttf2woff2 from "gulp-ttf2woff2";
import plumber from "gulp-plumber"; // Подключаем gulp-plumber для обработки ошибок

// Обработчик ошибок
function handleErrors(task) {
  return plumber({
    errorHandler: function (err) {
      console.error(`Error in ${task} task:`, err.toString());
      this.emit("end"); // Не прерываем задачу при ошибке
    },
  });
}

// Удаление оригинальных изображений
function cleanOriginalImages() {
  return deleteAsync(["app/images/dist/**/*.{jpg,jpeg,png}"], { force: true });
}

// Настройка BrowserSync
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    ghostMode: {
      clicks: false,
    },
    notify: false,
    online: true,
  });
}

// Обработка скриптов с ошибками
function scripts() {
  return src(["app/js/*.js", "!app/js/*.min.js"])
    .pipe(handleErrors("scripts"))
    .pipe(
      webpackStream(
        {
          mode: "production",
          performance: {
            hints: false,
          },
          plugins: [
            new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "window.jQuery": "jquery",
            }),
          ],
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env"],
                    plugins: ["babel-plugin-root-import"],
                  },
                },
              },
            ],
          },
          optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  format: {
                    comments: false,
                  },
                },
                extractComments: false,
              }),
            ],
          },
        },
        webpack
      )
    )
    .pipe(concat("app.min.js"))
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

// Обработка стилей без кэширования и зависимостей
function styles() {
  return src([
    `app/styles/${preprocessor}/*.*`,
    `!app/styles/${preprocessor}/_*.*`,
  ])
    .pipe(handleErrors("styles")) // Добавляем обработку ошибок
    .pipe(sassglob()) // Поддержка глобальных импортов
    .pipe(
      sass
        .sync({
          outputStyle: "compressed",
        })
        .on("error", sass.logError)
    )
    .pipe(
      postCss([
        autoprefixer({
          grid: "autoplace",
        }),
        cssnano({
          preset: ["default", { discardComments: { removeAll: true } }],
        }),
      ])
    )
    .pipe(concat("app.min.css"))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

// Обработка изображений с ошибками
async function images() {
  await src("app/images/src/**/*.{jpg,png,svg,webp,ico}")
    .pipe(handleErrors("images"))
    .pipe(changed("app/images/dist"))
    .pipe(
      imagemin([
        imageminWebp({ quality: 80 }),
        imageminSvgo(),
        imageminOptipng(),
      ])
    )
    .pipe(dest("app/images/dist"));

  await cleanOriginalImages();

  browserSync.reload();
}

// Компиляция Pug в HTML с ошибками
function pug2html() {
  let dataFromFile;

  try {
    dataFromFile = JSON.parse(Fs.readFileSync("app/pug/includes/data.json"));
  } catch (error) {
    console.error("Ошибка чтения JSON:", error);
    dataFromFile = {};
  }

  return src("app/pug/**/*.pug")
    .pipe(handleErrors("pug2html"))
    .pipe(changed("app", { extension: ".html" }))
    .pipe(
      pug({
        doctype: "html",
        pretty: true,
        locals: dataFromFile || {},
      })
    )
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

// Конвертация TTF файлов в WOFF2 с ошибками
function fonts() {
  return src("app/fonts/*.ttf")
    .pipe(handleErrors("fonts"))
    .pipe(changed("dist/fonts", { extension: ".woff2" }))
    .pipe(ttf2woff2())
    .pipe(dest("dist/fonts"))
    .on("end", async () => {
      await deleteAsync("dist/fonts/*.ttf", { force: true });
    });
}

// Очистка папки dist с ошибками
async function cleandist() {
  await deleteAsync(["dist/**/*", "app/**/*.html"], { force: true });
}

// Копирование файлов для сборки с ошибками
function buildcopy() {
  return src(
    [
      "{app/js,app/css}/*.min.*",
      "app/images/**/*.*",
      "!app/images/src/**/*",
      "app/fonts/**/*",
      "app/**/*.html",
    ],
    { base: "app/" }
  )
    .pipe(handleErrors("buildcopy"))
    .pipe(dest("dist"));
}

// Деплой на сервер
function deploy() {
  return src("dist/").pipe(
    rsync({
      root: "dist/",
      hostname: "username@yousite.com",
      destination: "yousite/public_html/",
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    })
  );
}

// Наблюдение за изменениями
function startwatch() {
  watch(`app/styles/${preprocessor}/**/*`, { usePolling: true }, styles);
  watch(
    ["app/js/**/*.js", "!app/js/**/*.min.js"],
    { usePolling: true },
    scripts
  );
  watch(
    "app/images/src/**/*.{jpg,png,svg,webp,ico}",
    { usePolling: true },
    images
  );
  watch("app/pug/**/*.pug", { usePolling: true }, pug2html);
  watch("app/fonts/*.ttf", { usePolling: true }, fonts);
  watch("app/**/*.{html,htm,txt,json,md,woff2}", { usePolling: true }).on(
    "change",
    browserSync.reload
  );
}

// Экспорт задач
export { scripts, styles, images, fonts, deploy };
export let assets = series(scripts, styles, images, fonts);
export let build = series(
  cleandist,
  pug2html,
  parallel(styles, scripts, images, fonts),
  buildcopy
);
export default series(
  pug2html,
  scripts,
  styles,
  images,
  fonts,
  parallel(browsersync, startwatch)
);
