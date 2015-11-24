console.log("webGui");
// draw square with data-x attr
// draw row with data-y attr. each row has a set of squares
var webGui = {
  board: function(size){
    var b = {
      setSquare: function(move, piece){
        $('.row').eq(move.y).find('.col').eq(move.x).text(piece);
      }
    };
    // create NxN grid
    for (var i=0; i < size; i++){
      // b.grid.push([]);
      $("#container").append('<div class="row">');
      for (var j=0; j < size; j++){
        $(".row").eq(i).append('<div class="col">');
        // b.grid[i].push(null);
      }
    }
    // change width and height of squares
    $(".row").css("height", "calc(75vh / " + size + ")");
    $(".col").css({"width": "calc(100% / " + size + ")",
                  "height": "calc(75vh / " + size + ")",
                  "line-height": "calc(75vh / " + size + ")"});
    return b;
  },

};

$(document).ready(function(){
    var b = webGui.board(4);
    b.setSquare({y:0, x:0}, 'T');
    b.setSquare({y:0, x:1}, 'I');
    b.setSquare({y:0, x:2}, 'M');
    b.setSquare({y:1, x:0}, 'W');
    b.setSquare({y:1, x:1}, 'A');
    b.setSquare({y:1, x:2}, 'S');
    b.setSquare({y:2, x:0}, 'H');
    b.setSquare({y:2, x:1}, 'E');
    b.setSquare({y:2, x:2}, 'R');
});