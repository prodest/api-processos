const config = require( './config/app' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const apiMiddleware = require( 'node-mw-api-prodest' ).middleware;

let app = express();

app.use( apiMiddleware( {
    compress: true,
    cors: true,
    authentication: {
        jwtPublicKey: config.jwtPublicKey
    },
    limit: {
        max: 300,
        duration: 10 * 60 * 1000,
        perSecond: 10,
        redisUrl: config.redisUrl,
        apiId: 'api-sep'
    }
} ) );

// load our routes
require( './routes/home' )( app );

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
