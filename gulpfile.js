const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

gulp.task('clean', async function () {
    del.sync('dist');
});

gulp.task('css', () => {
    return gulp.src('app/css/index.min.css').pipe(gulp.dest('dist/css'));
});

gulp.task('styles', function () {
    return gulp
        .src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/swiper/css/swiper.min.css',
            'app/css/fontawesome.min.css',
            'app/css/solid.min.css',
            'app/css/style.css',
            'app/css/intro-elements.css',
            'app/css/prices-elements.css',
            'app/css/buttons.css',
            'app/css/dialogs.css',
            'app/css/carousel.css',
            'app/css/menu-button.css',
            'app/css/drop-down-menu.css',
            'app/css/laptop.css',
            'app/css/tablet.css',
            'app/css/mobile.css',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('index.min.css'))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('export', async function () {
    gulp.src('app/webfonts/*').pipe(gulp.dest('dist/webfonts'));
    gulp.src('app/img/*').pipe(gulp.dest('dist/img'));
});

gulp.task('html', function () {
    return gulp
        .src('app/*.html')
        .pipe(
            htmlmin({
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                continueOnParseError: true,
                removeAttributeQuotes: true,
            })
        )
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src('app/js/index.min.js').pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function () {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/swiper/js/swiper.min.js',
            'node_modules/inputmask/dist/min/jquery.inputmask.bundle.min.js',
            'node_modules/body-scroll-lock/lib/bodyScrollLock.min.js',
            'app/js/index.js',
        ])
        .pipe(concat('index.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

// Static Server + watching html/css files
gulp.task('serve', function () {
    browserSync.init({
        server: 'app/',
    });

    gulp.watch('app/index.html').on('change', browserSync.reload);
    gulp.watch('app/img/**').on('change', browserSync.reload);
    gulp.watch(['app/css/**', '!app/**/*.min.**']).on(
        'change',
        gulp.series('styles', browserSync.reload)
    );
    gulp.watch(['app/js/**', '!app/**/*.min.**']).on(
        'change',
        gulp.series('scripts', browserSync.reload)
    );
});

gulp.task(
    'build',
    gulp.series(
        gulp.parallel('clean', 'styles', 'scripts'),
        gulp.parallel('export', 'html', 'css', 'js')
    )
);
gulp.task('default', gulp.parallel('styles', 'scripts', 'serve'));
