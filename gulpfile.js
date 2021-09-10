const {src, dest, watch} = require('gulp');
const minifyCss = require('gulp-clean-css');
const sourceMap = require('gulp-sourcemaps');
const concat = require('gulp-concat');

const cssFiles = ['./css/reset.css', './css/style.css', './css/nav.css']

const bundleCss = () =>{
    return src(cssFiles)
    .pipe(sourceMap.init())
    .pipe(minifyCss())
    .pipe(concat('bundle.css'))
    .pipe(sourceMap.write())
    .pipe(dest('./dist'));
}

const devWatch = () =>{
    watch('./css/*.css', bundleCss);
}

exports.bundleCss = bundleCss;
exports.devWatch = devWatch;