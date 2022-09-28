var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require("gulp-sourcemaps");
 
var paths = {
    styles: {
        scss: "public/sass/main.scss",
        src: "public/sass/**/*.scss",
        dest: "public/css"
    }
};

function compile(){
    return (
        gulp
            .src(paths.styles.scss)
            .pipe(sourcemaps.init())    
            .pipe(sass())
            .on("error", sass.logError)
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest))
    );
}
 
function watch(){
    compile();
    gulp.watch(paths.styles.src, compile);
}

exports.watch = watch;
exports.compile = compile;