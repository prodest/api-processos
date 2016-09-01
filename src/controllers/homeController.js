const moment = require( 'moment' );

const sepService = require( '../services/sep' );

module.exports = () => {
    var homeController = new Object();

    function notFound( next ) {
        let error = new Error('Processo não encontrado.');
        error.status = 404;
        error.handled = true;
        error.userMessage = error.message;
        next( error );
    }
 
    homeController.getSingle = ( req, res, next ) => {

        const procNumber = req.params.number;

        if ( !procNumber || procNumber.length <= 1 ) {
            return notFound( next );
        }

        sepService().getDocumentInfo( procNumber )
            .then( result => {
                if ( !result || typeof result !== 'object' ) {
                    throw new Error("Result not expected.");
                }

                const p = result.ProcessoHistorico;

                if ( !p.Interessado ) {
                    return notFound( next );
                }

                const updates = p.Andamento.ProcessoLocalizacao.map( a => {
                    return {
                        date: moment( a.Data, 'DD/MM/YYYY HH:mm' ),
                        agency: a.Orgao,
                        area: a.Local,
                        status: a.Situacao
                    };
                } );

                const info =
                    {
                        number: p.NumeroProcesso,
                        parts: p.Interessado.string,
                        subject: p.Assunto,
                        summary: p.Resumo,
                        status: p.Situacao,
                        updates: updates,
                        district: p.Municipio,
                        extra: p.IdentificacoesDiversas
                    };


                return res.json( info );
            } )
            .catch( err => {
                next( err );
            } );
    };

    return homeController;
};
