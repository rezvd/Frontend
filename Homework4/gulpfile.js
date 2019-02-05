var gulp = require('gulp');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var path = {
    css: './src/**/*.css',
    html: {
        pages: './src/pages/**/*.hbs',
        components: './src/components/**/*.hbs',
        componentsPath: './src/components/'
    },
    images: './src/**/images/*',
    build: {
        root: './build/**',
        css:  './build/',
        html: './build/',
        images: './build/images/'
    }
};

gulp.task('html', function () {
    return gulp.src(path.html.pages)
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: path.html.componentsPath
        }))
        .pipe(rename({
            dirname: '.',
            extname: '.html'
        }))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('css', function () {
    return gulp.src(path.css)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(postcss([autoprefixer()]))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('images', function () {
    return gulp.src(path.images)
        .pipe(rename({
            dirname: '.'
        }))
        .pipe(gulp.dest(path.build.images))
});

gulp.task('watch', function () {
    gulp.watch(path.css, gulp.series('css'));
    gulp.watch(path.html.pages, gulp.series('html'));
    gulp.watch(path.html.components, gulp.series('html'));
    gulp.watch(path.images, gulp.series('images'));
});

gulp.task('hotReload', function() {
    browserSync.init({
        server: {
            baseDir: path.build.html
        }
    });
    gulp.watch(path.build.root, browserSync.reload);
});

gulp.task('reload', gulp.parallel(
    'watch', 'hotReload'
));

gulp.task('prod', gulp.series(
    'css', 'html', 'images'
));

gulp.task('default', gulp.series(
    'prod', 'reload'
));