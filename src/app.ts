import config from './config/app';
import * as bodyParser from 'body-parser';

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

import * as express from 'express';
import * as middlewareModule from 'node-mw-api-prodest';
const apiMiddleware = middlewareModule.middleware;

let app = express();

app.use( bodyParser.json() );

app.use( apiMiddleware( {
    compress: true,
    cors: true
} ) );

app.use( apiMiddleware( {
    authentication: {
        jwtPublicKey: config.jwtPublicKey
    }
} ) );

// load our routes
import processRoutes from './routes/process';
processRoutes( app );

app.use( apiMiddleware( {
    error: {
        notFound: true,
        debug: config.env === 'development'
    }
} ) );

let pathApp = express();

let path = config.path;
pathApp.use( path, app );

export default pathApp;
