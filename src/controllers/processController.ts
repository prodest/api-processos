import moment from 'moment';

import pushConfig from '../config/push';
import sep from '../config/app';

import { DataFavorite } from '../services/data-favorite';
import { PushService } from '../services/push';
import { SepService } from '../services/sep';

export class ProcessController {
    private processController = new Object();
    private dataService = undefined;
    private pushService = undefined;

    constructor( private sepService: SepService = new SepService(), private dataFavorite: DataFavorite = new DataFavorite() ) {
        this.pushService = new PushService( pushConfig.push_url, pushConfig.username, pushConfig.password );
    }

    private notFound( next ) {
        const error = new Error( 'Processo não encontrado.' );
        error.userMessage = error.message;
        error.handled = true;
        error.status = 404;
        next( error );
    }

    private wrongNumber( next ) {
        const error = new Error( 'O número do processo deve possuir apenas números e ter entre 2 e 8 dígitos.' );
        error.userMessage = error.message;
        error.handled = true;
        error.status = 400;

        return next( error );
    }

    public getSingle = ( req, res, next ) => {

        const procNumber = req.params.number;

        const mask = /^\d{2,8}$/;
        if ( !mask.test( procNumber ) ) {
            return this.wrongNumber( next );
        }

        this.sepService.getDocumentInfo( procNumber )
            .then( result => {
                if ( !result || typeof result !== 'object' ) {
                    throw new Error( 'Result not expected.' );
                }

                const p = result.ProcessoHistorico;

                if ( !p.Interessado ) {
                    return this.notFound( next );
                }

                const updates = p.Andamento.ProcessoLocalizacao.map( a => {
                    return {
                        date: moment( a.Data, 'DD/MM/YYYY HH:mm' ),
                        agency: a.Orgao,
                        area: a.Local,
                        status: a.Situacao
                    };
                });

                const info =
                    {
                        number: p.NumeroProcesso,
                        parts: p.Interessado.string,
                        subject: p.Assunto,
                        summary: p.Resumo,
                        status: p.Situacao,
                        updates: updates,
                        district: p.Municipio,
                        extra: p.IdentificacoesDiversas,
                        pageUrl: sep.url_web + p.NumeroProcesso
                    };


                return res.json( info );
            })
            .catch( err => {
                next( err );
            });
    };

    public update( req, res, next ) {
        const data = req.body;

        this.getUsersBySepProtocol( req, res, next )
            .then( usersToPush => {
                const message = `Processo ${data.number} atualizado`;
                const state = 'app.sepConsulta/:processNumber';
                const params = { processNumber: `${data.number}` };

                return this.pushService.send( usersToPush, message, state, params );
            })
            .then(() => res.send( 'ok' ) )
            .catch( error => next( error ) );
    }

    public saveFavorite( req, res, next ) {
        const data = req.body;
        data.id = parseInt( req.decodedToken.sub );
        delete data.userId;

        return this.dataFavorite.saveFavorite( data )
            .then( data => res.send( data ) )
            .catch( error => next( error ) );
    }

    public getFavorite( req, res, next ) {
        const sub = parseInt( req.decodedToken.sub );

        return this.dataFavorite.saveFavorite( sub )
            .then( data => res.send( data ) )
            .catch( error => next( error ) );
    }

    public getUsersBySepProtocol( req, res, next ) {
        let number = parseInt( req.params.number );

        return this.dataFavorite.getUsersBySepProtocol( number )
            .then( data => res.send( data ) )
            .catch( error => next( error ) );
    }
}
