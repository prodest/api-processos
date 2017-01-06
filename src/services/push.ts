import rp from 'request-promise';

export class PushService {

    private _url = '';
    private _username = '';
    private _password = '';

    constructor( url, username, password ) {
        this._url = url;
        this._username = username;
        this._password = password;
    };

    private sendRequest( data, authorization ) {
        const options = {
            method: 'POST',
            uri: this._url,
            body: data,
            json: true,
            headers: {
                'Authorization': authorization
            }
        };

        return rp( options );
    };

    public send( users, message, state, stateParams, icon ) {
        const authorization = 'Basic ' + Buffer.from( this._username + ':' + this._password ).toString( 'base64' );

        const pushData = {
            users: users,
            message: message,
            state: state,
            params: stateParams,
            icon: icon
        };

        this.sendRequest( pushData, authorization );
    };
}
