const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const ts = require( 'gulp-typescript' );
const path = require( 'path' );
const clean = require( 'gulp-clean' );

let paths = {
    srcPath: 'src/',
    buildPath: 'dist/',
    src: [ 'src/**/*.ts' ],
    build: [ 'dist/' ]
};

gulp.task( 'clean', function() {
    return gulp
        .src( paths.build, { read: false } )
        .pipe( clean() );
} );

gulp.task( 'build', [ 'clean' ], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src( paths.src )
        .pipe( sourcemaps.init() )
        .pipe( ts() )
        .pipe( sourcemaps.write( '.', { includeContent: true, sourceRoot: () => path.join( __dirname, paths.srcPath ) } ) )
        .pipe( gulp.dest( paths.buildPath ) );
} );

gulp.task( 'build:prod', [ 'clean' ], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    return gulp.src( paths.src )
        .pipe( ts() )
        .pipe( gulp.dest( paths.buildPath ) );
} );
