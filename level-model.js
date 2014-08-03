var defaultTile = new TileDef( 0, { solid: false } );

function LevelModel( options ) {

    this.player = options.player;
    this.tiles = options.tiles;
    this.entities = [].concat.apply( [], options.entities );

    this.tileCols = _.max( _.map( this.tiles, 
        function( line ) { 
            return line.length; 
        } 
    ));
    this.tileRows = this.tiles.length;

}

LevelModel.prototype.getTile = function( x, y ) {
    return !this.tiles[ y ] ? defaultTile :
           !this.tiles[ y ][ x ] ? defaultTile : this.tiles[ y ][ x ];
}

LevelModel.prototype.getBlockedByEntity = function( x, y ) {
    return _.find( this.entities, function( entity ) {
        return entity.x == x && entity.y == y;
    } );
}