const sepService = require( '../services/sep' );

module.exports = () => {
    var homeController = new Object();

    function notFound( res ) {
        return res.status( 404 ).send( 'Processo não encontrado.' );
    }

    function serverError( res ) {
        return res.status( 500 ).json( undefined );
    }

    homeController.getSingle = ( req, res ) => {

        const procNumber = req.params.number;

        if ( !procNumber ) {
            return notFound( res );
        }

        sepService().getDocumentInfo( procNumber )
            .then( result => {
                if ( !result || typeof result !== 'object' ) {
                    return serverError;
                }

                const p = result.ProcessoHistorico;

                if ( !p.Interessado ) {
                    return notFound( res );
                }

                const updates = p.Andamento.ProcessoLocalizacao.map( a => {
                    return {
                        date: a.Data,
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
                console.log( err );
                serverError( res );
            } );
    };

    return homeController;
};
