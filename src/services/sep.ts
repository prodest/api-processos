import soap from 'soap-as-promised';
import sep from '../config/app';

export class SepService {

    getDocumentInfo( processNumber ) {
        let args = { numeroProcesso: processNumber };

        return soap.createClient( sep.service_url )
            .then( client => client.ConsultarProcessoSimplesPorNumero( args ) );
    };

}