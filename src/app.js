const config = require( './config/app' );
const bodyParser = require( 'body-parser' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const apiMiddleware = require( 'node-mw-api-prodest' ).middleware;

let app = express();

app.use( bodyParser.json() );

app.use( apiMiddleware( {
    compress: true,
    cors: true
} ) );

// load our routes
require( './routes/home' )( app );
require( './routes/process' )( app );

app.use( apiMiddleware( {
    error: {
        notFound: true,
        debug: config.env === 'development'
    }
} ) );

let pathApp = express();

let path = config.path;
pathApp.use( path, app );

module.exports = pathApp;
