function build(builder, f) {
    var s = f.toString();
    var x = s.match(/\/\*\r?\n([^\*]*)/);
    var y = x[0].split(/\r?\n/);
    return _.map(y.splice(1, y.length-2), function(line) {
        return _.map(line, function(x) {
            return builder[ x == " " ? 0 : Number(x) ]();
        });
    });
}



function push(arr, el) {
    arr.push(el); return el;
}
function set(obj, key, el) {
    obj[key] = el; return el;
}

function getTile(x, y) {
    return !model.tiles[y] ? tileBuilder[0]() :
           !model.tiles[y][x] ? tileBuilder[0]() : model.tiles[y][x];
}
 
function getBlockedByEntity(x, y) {
    return _.find(model.entities, function(entity) {
        return entity.x == x && entity.y == y;
    });
}



function TileDef(blockId, opts) {
    this.blockId = blockId;
    _.extend(this, opts);
}

function Tile(blockId, tileDef, opts) {
    this.blockId = blockId;
    this.tileDef = tileDef;
    _.extend(this, tileDef, opts);
}

function Entity(x, y, className) {
    this.x = x; this.y = y;
    this.className = className;
    
    this.onMoveCallback = function() {};
    
    this.move = function(x, y) {
        var newX = this.x + x,
            newY = this.y + y;
        var tile = getTile(newX, newY),
            entity = getBlockedByEntity(newX, newY);
        
        if (tile.solid) {
            if (this == player) onPlayerBumpTile(tile);
        } else if (entity) {
            if (this == player) onPlayerBumpEntity(entity);
        } else {
            this.x = newX; this.y = newY;
            this.onMoveCallback();
            if (this == player) onPlayerPerformAction();
        }
    };
}







// Data

var tileBuilder = {};
(function() {
 
    function immutableTile(blockId, opts) {
        
        var tile = new TileDef(blockId, opts);
        
        set(tileBuilder, blockId, function() {
            return tile;
        });
    }
    
    immutableTile(0, { solid: false });
    immutableTile(1, { solid: true });
    immutableTile(3, { solid: true });
    immutableTile(4, { solid: true });
    immutableTile(5, { solid: false });
    immutableTile(6, { solid: false });
    immutableTile(7, { solid: false });
    
    set(tileBuilder, 2, function() {
        return new Tile(2, null, {
            solid: true,
            money: Math.floor(Math.random() * 100),
            onBump: function() {
                if (this.money > 0) {
                    this.money = 0;
                    console.log("Add money!");
                    this.blockId = "2-open";
                    return {turns: 1};
                }
            }
        });
    });

    set(tileBuilder, 8, function() {
        return new Tile(8, null, {
            solid: true,
            open: false,
            onBump: function() {
                if (!this.open) {
                    this.open = true;
                    this.solid = false;
                    this.blockId = "8-open";
                    return {turns: 1};
                }
            }
        });
    });
    
})();

var tiles = build(tileBuilder, function() { /*
111111111111111111111111111111111111111111
1         1                   1          1
1         1              5    8  2 2     1
1         1                   1          1
1     2   111111  11111111111111111      1
4                 13333333333            1
1                 1333333                1
1     33333333    1333         2 2       1
4     33333333  2 1           2 2 2      1
1                 1                      1
1                                        1
1111111             111181111  11111111111
1111111  61111111              61
1111111 7 1111111      6        1
111111111111111111111111111111111
*/});

var enemies = [ 
  new Entity(1, 4, "enemy"), 
  new Entity(4, 4, "enemy"), 
  new Entity(5, 4, "enemy") ];

var player = new Entity(1, 1, "player");

var model = {
    tiles : tiles,

    boardWidth: _.max(_.map(tiles, function(line) { return line.length; })),
    boardHeight: tiles.length,

    entities: [ player ].concat( enemies ),
    player: player

}


function onPlayerBumpTile(tile) {
    if (tile.onBump) {
        var result = tile.onBump();
        if (result && result.turns) onPlayerPerformAction();
    }
}
function onPlayerBumpEntity(entity) {
}
function onPlayerPerformAction() {
    _.each(enemies, function(enemy) {
        enemy.move(
            Math.floor(Math.random() * 3 - 1),
            Math.floor(Math.random() * 3 - 1));
    });
}