
function getElement( elem ) {
    if (typeof elem == 'string') { return document.getElementById( elem ); }
    return elem;
}

function GameController( options ) {
    
    var inventoryComponent = React.renderComponent( 
        new InventoryView( { model: options.levelModel } ), 
        getElement( options.inventoryContainer ) );
    

    var dialogComponent = React.renderComponent( 
        new DialogView( ), 
        getElement( options.dialogContainer ) );


    var view = makeScrollableView( 
        getElement( options.viewContainer ), 
        options.levelModel, 
        player );

    var dialogModel = options.dialogModel;


    this.events = new EventEmitter2();


    function handleKeyEvents( ev ) {

        if ( dialogComponent.hasDialog() ) {

            if ( dialogComponent.handleKeyEvent( ev ) ) {
                return true;
            }
        }
        else {

            var dx = ( ev.keyCode == 39 ) - ( ev.keyCode == 37 );
            var dy = ( ev.keyCode == 40 ) - ( ev.keyCode == 38 );
  
            if ( dx || dy ) {
                options.playerController.move( dx, dy );
                view.refresh();
                return true;
            }

        }

    };

    $( window ).on( "keydown", function( ev ) {

        if ( handleKeyEvents( ev ) ) {

            this.events.emit( 'update' );
            return false;

        }

    }.bind( this ) );

    dialogModel.events.on('dialog', function( dialog ) {

        dialogComponent.setProps( { dialog: dialog } );

    });

    options.playerController.onPlayerPerformAction = function() {
        options.enemyController.updateAll( );
        inventoryComponent.setProps( { model: options.levelModel } );
    };

}