
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

    entities: [ player ].concat( enemies ),
    player: player

}

enemyController.pushAll(enemies);