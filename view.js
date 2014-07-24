$(function() {
  
var c = $("#container");
var inner = $("#inner");

var tileWidth = 32, tileHeight = 32;


inner.css( { 'width': boardWidth * tileWidth, 'height': boardHeight * tileHeight } );

for ( var j = 0; j < boardHeight; j++ ) {
    for ( var i = 0; i < boardWidth; i++ ) {
        var d = $("<div>").addClass("tile");
        d.addClass( "block" + getTile(i, j).blockId );
        inner.append(d);
    }
}

function attachEntityCallback(entity, div) {
  
    entity.onMoveCallback = function() {
        div.css({ "left": entity.x * tileWidth,
                  "top": entity.y * tileHeight });
    };
    entity.onMoveCallback();
    return entity.onMoveCallback;
}



var playerDiv = $("<div>").addClass("player").appendTo(inner);
attachEntityCallback(player, playerDiv);

_.each(enemies, function(enemy) {
    var div = $("<div>").addClass("enemy").appendTo(inner);
    attachEntityCallback(enemy, div);
});

$(window).on("keydown", function(ev) {

    var dx = (ev.keyCode == 39) - (ev.keyCode == 37);
    var dy = (ev.keyCode == 40) - (ev.keyCode == 38);
    if (dx || dy) {
        player.move(dx, dy);
        return false;
    }
});

function update() {
  
    var targetX = -(player.x * tileWidth - 200),
        targetY = -(player.y * tileHeight - 200);
    var currentX = inner.position().left,
        currentY = inner.position().top;
      
    inner.css('left', currentX + (targetX - currentX) / 20);
    inner.css('top', currentY + (targetY - currentY) / 20);

    requestAnimationFrame(update);
}

update();

});

