
var tileWidth = 32, tileHeight = 32;


var View = React.createClass({
    render: function() {
        var tiles = [];

        var boardWidth = this.props.model.boardWidth,
            boardHeight = this.props.model.boardHeight;

        for ( var j = 0; j < boardHeight; j++ ) {

            for ( var i = 0; i < boardWidth; i++ ) {

                var blockId = getTile(i, j).blockId;
                var key = j * boardWidth + i;

                tiles.push(
                    new React.DOM.div({ key: key, className: "tile block" + blockId }, "")
                );

            }
        }

        _.each( this.props.model.entities, function( entity ) {

            var style = {
                left: entity.x * tileWidth,
                top: entity.y * tileHeight
            };

            tiles.push(
                new React.DOM.div({ className: entity.className, style: style })
            );

        } );

        var style = { width: boardWidth * tileWidth, 
                      height: boardHeight * tileHeight };

        return new React.DOM.div({ id: "inner", style: style }, tiles);
    }
});

function refresh() { 
    React.renderComponent(new View({ model: model }), document.getElementById('container'));
}

refresh();




$(function() {
  
$(window).on("keydown", function(ev) {

    var dx = (ev.keyCode == 39) - (ev.keyCode == 37);
    var dy = (ev.keyCode == 40) - (ev.keyCode == 38);
    
    if (dx || dy) {
        model.player.move(dx, dy);
        refresh();
        return false;
    }

});

$(function() {


    var inner = $("#inner");

    function update() {
      
        var targetX = -(model.player.x * tileWidth - 200),
            targetY = -(model.player.y * tileHeight - 200);
        var currentX = inner.position().left,
            currentY = inner.position().top;
          
        inner.css('left', currentX + (targetX - currentX) / 20);
        inner.css('top', currentY + (targetY - currentY) / 20);

        requestAnimationFrame(update);
    }

    update();
});

});

