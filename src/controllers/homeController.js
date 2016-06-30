const sepService = require( '../services/sep' );

module.exports = () => {
    var homeController = new Object();

    homeController.getSingle = ( req, res ) => {

        sepService().getDocumentInfo( req.params.number )
            .then( result => {
                const p = result.ProcessoHistorico;
                const info =
                    {
                        number: p.NumeroProcesso,
                        parts: p.Interessado.string,
                        topic: p.Assunto,
                        summary: p.Resumo,
                        status: p.Situacao,
                        updates: p.Andamento.ProcessoLocalizacao,
                        district: p.Municipio,
                        extra: p.IdentificacoesDiversas
                    };


                return res.json( info );
            } )
            .catch( err => {
                console.log( err );
                return res.send( err.message );
            } );
    };

    return homeController;
};
