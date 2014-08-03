function build(builder, f) {
    var s = f.toString();
    var x = s.match(/\/\*\r?\n([^\*]*)/);
    var y = x[0].split(/\r?\n/);
    var data = _.map(y.splice(1, y.length-2), function(line) {
        return _.map(line, function(x) {
            return builder[ x == " " ? 0 : Number(x) ]();
        });
    });

    return {
        data: data,

        width: _.max(_.map(data, function(line) { return line.length; })),
        height: data.length
    }
}



function push(arr, el) {
    arr.push(el); return el;
}
function set(obj, key, el) {
    obj[key] = el; return el;
}

function getTile(x, y) {
    return !model.tiles.data[y] ? tileBuilder[0]() :
           !model.tiles.data[y][x] ? tileBuilder[0]() : model.tiles.data[y][x];
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
            money: Math.floor( Math.random() * 100 ),
            item: ( Math.random() < 0.5 ) ? { name : "Cool item" } : null,

            onBump: function( player ) {

                var useChest = false;

                if (this.money > 0) {

                    player.money += this.money;
                    this.money = 0;
                    useChest = true;

                }

                if ( this.item ) {

                    player.inventory.push( this.item );
                    this.item = null;
                    useChest = true;

                }

                if ( useChest ) {
                    
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
            onBump: function( player ) {
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

function onPlayerBumpTile(tile) {
    if (tile.onBump) {
        var result = tile.onBump( player );
        if (result && result.turns) onPlayerPerformAction();
    }
}
function onPlayerBumpEntity(entity) {
    if (entity.onBump) {
        var result = entity.onBump( player );
        if (result && result.turns) onPlayerPerformAction();
    }
}
function onPlayerPerformAction() {
    enemyController.updateAll();
}

var enemyController = {
    enemies: [],
    pushAll: function(enemies) {
        Array.prototype.push.apply(this.enemies, enemies);
    },
    updateAll: function() {
        _.each(this.enemies, function(enemy) {
            enemy.move(
                Math.floor(Math.random() * 3 - 1),
                Math.floor(Math.random() * 3 - 1));
        });
    }
}

var dialogController = {
    events: new EventEmitter2()
}
