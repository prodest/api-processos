const moment = require( 'moment' );

const sepService = require( '../services/sep' );

module.exports = () => {
    var homeController = new Object();

    function notFound( next ) {
        const error = new Error( 'Processo não encontrado.' );
        error.status = 404;
        error.handled = true;
        error.userMessage = error.message;
        next( error );
    }

    function wrongNumber( next ) {
        const error = new Error( 'O número do processo deve possuir apenas números e ter entre 2 e 8 dígitos.' );
        error.userMessage = error.message;
        error.handled = true;
        error.status = 400;

        return next( error );
    }

    homeController.getSingle = ( req, res, next ) => {

        const procNumber = req.params.number;

        const mask = /^\d{2,8}$/;
        if ( !mask.test( procNumber ) ) {
            return wrongNumber( next );
        }

        sepService().getDocumentInfo( procNumber )
            .then( result => {
                if ( !result || typeof result !== 'object' ) {
                    throw new Error( 'Result not expected.' );
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
