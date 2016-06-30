const sepService = require( '../services/sep' );

module.exports = () => {
    var homeController = new Object();

    homeController.getSingle = ( req, res ) => {

        sepService().getDocumentInfo( req.params.number )
            .then( result => {
                if ( !result || typeof result !== 'object' ) {
                    return res.json( {} );
                }

                const p = result.ProcessoHistorico;

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
                return res.json( {} );
            } );
    };

    return homeController;
};
