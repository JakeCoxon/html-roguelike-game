
var tileWidth = 32, tileHeight = 32;

var WorldView = React.createClass({

    render: function( ) {

        var tiles = [], entities = [];

        var innerX = this.props.tileX || 0,
            innerY = this.props.tileY || 0,
            innerCols = this.props.cols,
            innerRows = this.props.rows;

        for ( var j = 0; j < innerRows; j++ ) {

            for ( var i = 0; i < innerCols; i++ ) {

                var blockId = this.props.model.getTile( innerX + i, innerY + j ).blockId;
                var key = j * innerRows + i;

                tiles.push(
                    new React.DOM.div( { key: key, className: "tile block" + blockId }, "" )
                );

            }
        }

        _.each( this.props.model.entities, function( entity, i ) {

            var style = { left: entity.x * tileWidth,
                          top: entity.y * tileHeight };

            entities.push(
                new React.DOM.div({ key: "e" + i, className: entity.className, style: style })
            );

        } );


        var innerStyle = { left: innerX * tileWidth,
                           top: innerY * tileHeight,
                           width: innerCols * tileWidth,
                           height: innerRows * tileHeight };

        var entitiesDivStyle = { position: "absolute",
                                 left: -innerX * tileWidth,
                                 top: -innerY * tileWidth };

        return new React.DOM.div( { id: "inner", style: innerStyle }, 
            tiles,
            new React.DOM.div({ style: entitiesDivStyle }, entities ) );

    }

})

var ScrollableView = React.createClass({

    render: function() {
        

        var innerCols = Math.floor( 800 / tileWidth ),
            innerRows = Math.floor( 800 / tileHeight );

        var innerX = Math.floor( this.props.cameraX / tileWidth ) - Math.floor( innerCols / 2 ),
            innerY = Math.floor( this.props.cameraY / tileHeight ) - Math.floor( innerRows / 2 );

        var boardWidth = this.props.model.tileCols,
            boardHeight = this.props.model.tileRows;

        var worldStyle = { left: - ( this.props.cameraX - 200 ),
                           top: - ( this.props.cameraY - 200 ),
                           width: boardWidth * tileWidth, 
                           height: boardHeight * tileHeight };

        return new React.DOM.div({ id: "world", style: worldStyle }, 

            new WorldView({ model: this.props.model,
                            tileX: innerX,
                            tileY: innerY,
                            cols: innerCols, 
                            rows: innerRows })

        );
    }
});



function makeScrollableView( container, model, player ) {

    var currentX = 0,
        currentY = 0;

    var updateCallbacks = [];


    var scrollableViewComponent = 
        React.renderComponent( new ScrollableView({ model: model,
                                                    cameraX: currentX,
                                                    cameraY: currentY }), container );

    function refresh() { 

        scrollableViewComponent.setProps({ model: model,
                                           cameraX: currentX,
                                           cameraY: currentY });

    }

    

    $(function() {


        function update() {
          
            var targetX = player.x * tileWidth,
                targetY = player.y * tileHeight;
            
            var increaseX = (targetX - currentX) / 20,
                increaseY = (targetY - currentY) / 20;

            currentX += increaseX;
            currentY += increaseY;
              
            _.each( updateCallbacks, function( callback ) { 
                callback( ); 
            });

            requestAnimationFrame( update );
        }

        
        refresh();

        update();

        updateCallbacks.push( refresh );



    });

    return {
        onUpdate: function( callback ) {

            updateCallbacks.push( callback );

        },
        refresh: refresh
    };


}
