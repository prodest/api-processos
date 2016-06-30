const config = require( './config/app' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const compress = require( 'compression' );

let app = express();

app.use( compress() );

// Enable CORS http://enable-cors.org/server_expressjs.html
app.use( ( req, res, next ) => {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    next();
} );

// load our routes
app = require( './routes/home' )( app );

// error handlers

// catch 404 and forward to error handler
app.use( ( req, res, next ) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

// development error handler
// will print full error
if ( config.env === 'development' ) {
    app.use( ( err, req, res, next ) => {
        res.status( err.status || 500 );
        console.log( err );
        res.json(
            {
                err: err.message,
                stack: err.stack
            } );
    } );
}

// production error handler
// only error message leaked to user
app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );
    console.log( err.stack );
    res.json( {
        err: err.message,
        fields: []
    } );
} );

var pathApp = express();

let path = config.path;
pathApp.use( path, app );

module.exports = pathApp;
