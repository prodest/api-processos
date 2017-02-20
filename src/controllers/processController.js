const dataService = require( '../services/data' )();
const pushService = require( '../services/push' )();

module.exports = () => {
    var processController = new Object();

    processController.update = ( req, res, next ) => {

        const data = req.body;

        dataService.getUsersBySepProtocol( data.number )
            .then( usersToPush => {
                const pushData = {
                    users: usersToPush,
                    android: {
                        collapseKey: 'optional',
                        data: {
                            message: `Processo ${data.number} atualizado`,
                            appData: {
                                state: 'app.sepConsulta/:processNumber',
                                params: {
                                    processNumber: `${data.number}`
                                }
                            }
                        }
                    },
                    ios: {
                        badge: 0,
                        sound: 'soundName',
                        alert: `Processo ${data.number} atualizado`,
                        appData: {
                            state: 'app.sepConsulta/:processNumber',
                            params: {
                                processNumber: `${data.number}`
                            }
                        }
                    }

                };

                return pushService.sendPush( pushData );
            } )
            .then( () => {
                console.log(`Atualização no processo ${data.number} enviada com sucesso ao push server.\n`);
                res.send( 'ok' );
            )
            .catch( error => next( error ) );
    };

    return processController;
};
