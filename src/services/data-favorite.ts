import dataConfig from '../config/rethinkdb';
import { DataService } from 'prodest-espm-storage';

export class DataFavorite {
    private entityName = 'favoriteSepProtocol';
    private entity = undefined;

    constructor( private dataService: DataService = new DataService() ) {
        this.dataService = new DataService( dataConfig.host, dataConfig.port, dataConfig.authKey, dataConfig.db );
        const type = this.dataService.thinkTypes;
        const model = {
            favoriteProcess: [ type.number() ]
        };
        const indexes = [
            {
                name: 'favoriteProcess',
                options: { multi: true }
            }
        ];
        this.entity = this.dataService.defineResource( this.entityName, model, indexes );
    }

    public saveFavorite( data ) {
        return this.dataService.save( this.entity, data );
    }

    public getFavorite( sub ) {
        return this.dataService.get( this.entity, sub );
    }

    public getUsersBySepProtocol( number ) {
        return this.dataService.getAll( this.entity, number, 'favoriteProcess', item => item.id );
    }
}