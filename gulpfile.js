var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');

var vhostName = 'huskv3' + '.mcube.d3v';

var paths = {
	styles: {
		src: 'assets/scss/**/*.scss',
		dest: 'static/css/'
	},
	lib: {
		src: 'assets/js/lib/**/*.js',
		dest: 'static/js/lib'
	},
	scripts: {
		src: 'assets/js/**/*.js',
		dest: 'static/js'
	},
	html: {
		src: 'index.html'
	},
	tmp: 'assets/temp'
};

function taskInitBrowserSync() {
	return browserSync({
		proxy: vhostName,
		ghostMode: false,
		open: false,
		logPrefix: vhostName
	});
}

function taskClean() {
	return del([paths.styles.dest, paths.lib.dest, paths.scripts.dest]).then(function (paths) {
		console.log('Build cleaned !\n');
	});
}

function taskStyles() {
	var stream = gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 4 versions'))
		.pipe(gulp.dest(paths.tmp))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(filter('**/*.css'))
		.pipe(reload({stream: true}));
	return stream;
}

function taskLib() {
	return gulp.src(paths.lib.src)
		.pipe(gulp.dest(paths.lib.dest));
}

function taskLint() {
	return gulp.src(paths.scripts.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
}

function taskScripts() {
	return gulp.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(paths.tmp))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.scripts.dest));
}

function taskWatch() {
	gulp.watch(paths.styles.src, taskStyles);
	gulp.watch(paths.lib.src, taskLib).on('change', browserSync.reload);
	gulp.watch(paths.html.src).on('change', browserSync.reload);
	gulp.watch(paths.scripts.src).on('change', gulp.series(taskLint, taskScripts, browserSync.reload));
}

const watching = gulp.parallel(taskInitBrowserSync, taskWatch);
const buildScripts = gulp.series(taskLint, taskScripts);

// Available Gulp Commands
exports.build = gulp.series(taskClean, gulp.parallel(taskStyles, taskLib, buildScripts));
exports.default = gulp.series(taskClean, gulp.parallel(taskStyles, taskLib, buildScripts), watching);
