console.log("webGui");
// draw square with data-x attr
// draw row with data-y attr. each row has a set of squares
var webGui = {
  board: function(){
    return {
      setSquare: function(move, piece){
        $('.row').eq(move.y).find('.col').eq(move.x).text(piece);
      }
    };
  },

};

$(document).ready(function(){
    var b = webGui.board();
    b.setSquare({y:0, x:0}, 'X');
    b.setSquare({y:0, x:1}, 'X');
    b.setSquare({y:0, x:2}, 'X');
    b.setSquare({y:1, x:0}, 'O');
    b.setSquare({y:1, x:1}, 'O');
    b.setSquare({y:1, x:2}, 'O');
    b.setSquare({y:2, x:0}, 'X');
    b.setSquare({y:2, x:1}, 'X');
    b.setSquare({y:2, x:2}, 'X');
});