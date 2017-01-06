import config from '../config/app';
import { ProcessController } from '../controllers/processController';

const verifyBasicAuthentication = ( token ) => {

    return ( req, res, next ) => {
        const authorizationHeader = req.get( 'Authorization' );
        if ( !authorizationHeader || authorizationHeader !== token ) {
            res.statusCode = 401;
            res.send( 'Access denied' );
        } else {
            next();
        }
    };
};

export default app => {
    let processController = new ProcessController();

    app.get( '/:number?', processController.getSingle );

    app.post( '/process/update', verifyBasicAuthentication( config.sepAuthToken ), processController.update );
    app.get( '/data/favorite/:number/users', verifyBasicAuthentication( config.sepAuthToken ), processController.getUsersBySepProtocol );
    app.post( '/data/favorite', processController.saveFavorite );
    app.get( '/data/favorite', processController.getFavorite );
};
