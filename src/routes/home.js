module.exports = app => {

    const homeController = require( '../controllers/homeController' )();

    app.get( '/:number', homeController.getSingle );

    return app;
};
