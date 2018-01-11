//////////////////////////
// gulpfile.js
// Jim McNeely
// 12/14/2017
////////////
// gulpfile for admin3 vue project
//////////////////////////

var gulp = require('gulp');

var concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    pug = require('gulp-pug2'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    clean = require('gulp-dest-clean');
    run_sequence = require('run-sequence');


var js_scripts = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/vue/dist/vue.js',
    './node_modules/vue-router/dist/vue-router.js',
    './node_modules/vuex/dist/vuex.js',
    './node_modules/vue-cookies/vue-cookies.js',
    './node_modules/moment/moment.js',
    './node_modules/axios/dist/axios.js',
    './node_modules/lodash/lodash.js',
    './node_modules/lodash-uuid/index.js',
    './node_modules/bootstrap/js/tab.js',
    './ignore/environment.js',
    './app/components/**/*.js',
    './app/pages/**/*.js',
    './app/filters/**/*.js',
    './app/router.js',
    './app/main.js',
];
var js_scripts_min = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/vue/dist/vue.min.js',
    './node_modules/vue-router/dist/vue-router.min.js',
    './node_modules/vuex/dist/vuex.min.js',
    './node_modules/vue-cookies/vue-cookies.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/axios/dist/axios.min.js',
    './node_modules/lodash/lodash.min.js',
    './node_modules/lodash-uuid/index.js',
    './node_modules/bootstrap/js/tab.js',
    './ignore/environment.js',
    './app/components/**/*.js',
    './app/pages/**/*.js',
    './app/filters/**/*.js',
    './app/router.js',
    './app/main.js',
];

var pug_files = [
  './app/components/**/*.pug',
  './app/pages/**/*.pug'
];

var scss_files = [
  './app/components/**/*.scss',
  './app/pages/**/*.scss',
]

gulp.task('js', function(){
  return gulp.src(js_scripts)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('js-min', function(){
  return gulp.src(js_scripts_min)
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});

gulp.task('sass-concat', function(){
  return gulp.src(scss_files)
    .pipe(concat('combined.scss'))
    .pipe(gulp.dest('app/css'))
});

gulp.task('sass-process', function(){
  return gulp.src('app/css/main.scss')
    .pipe(sass())
    .pipe(rename('index.css'))
    .pipe(gulp.dest('build'))
});

gulp.task('sass-min-process', function(){
  return gulp.src('app/css/main.scss')
    .pipe(sass())
    .pipe(uglifycss())
    .pipe(rename('index.css'))
    .pipe(gulp.dest('build'))
});

gulp.task('sass', function(done){
  run_sequence('sass-concat', 'sass-process');
  done();
})

gulp.task('index', function(){
  return gulp.src('app/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'))
});

gulp.task('templates', function(){
  return gulp.src(pug_files)
    .pipe(concat('templates.pug'))
    .pipe(gulp.dest('ignore'))
});

gulp.task('html', function(done){
  run_sequence('templates', 'index');
  done();
})

gulp.task('img', function(){
    return gulp.src(['app/img/**/*'])
      .pipe(clean('build/img'))
      .pipe(gulp.dest('build/img'))
});

gulp.task('language', function(){
    return gulp.src(['app/language/*'])
      .pipe(clean('build/language'))
      .pipe(gulp.dest('build/language'))
});

gulp.task('font', function(){
    gulp.src(['app/font-awesome/**/*.*'])
      .pipe(gulp.dest('build/font-awesome'));
});

gulp.task('watch', function(){
  gulp.watch('ignore/templates.pug', ['index']);
  gulp.watch('app/**/*.js', ['js']);
  gulp.watch('app/**/*.scss', ['sass']);
  gulp.watch('app/components/**/*.scss', ['sass']);
  gulp.watch('app/pages/**/*.scss', ['sass']);
  gulp.watch('app/index.pug', ['html']);
  gulp.watch('app/components/**/*.pug', ['html']);
  gulp.watch('app/pages/**/*.pug', ['html']);
  gulp.watch('app/fonts/**/*', ['font']);
  gulp.watch('app/language/*', ['language']);
  gulp.watch('app/img/**/*', ['img']);
});

gulp.task('test', function(){
  gulp.start('html');
})

gulp.task('start', function(){
  gulp.start('js');
  gulp.start('sass-process');
  gulp.start('img');
  gulp.start('language');
  gulp.start('font');
  gulp.start('html');
  gulp.start('watch');
});

gulp.task('exec', function(){
  gulp.start('js-min');
  gulp.start('sass-min');
  gulp.start('img');
  gulp.start('language');
  gulp.start('html');
  gulp.start('font');
});
