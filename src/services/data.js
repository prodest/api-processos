const rp = require( 'request-promise' );
const sep = require( '../config/sep' );

module.exports = () => {
    var dataService = new Object();

    dataService.getUsersBySepProtocol = ( processNumber ) => {
        const options = {
            uri: sep.data_service_url.replace( ':number', processNumber ),
            headers: {
                'Authorization': sep.data_service_auth_token
            },
            json: true
        };
        return rp( options );
    };

    return dataService;
};
