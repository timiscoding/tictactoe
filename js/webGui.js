console.log("webGui");

var webGui = {
  board: function(size){
    // remove any previous board
    $(".row").remove();
    // create NxN grid
    for (var i=0; i < size; i++){
      $("#container").append('<div class="row" y="' + i + '">');
      for (var j=0; j < size; j++){
        $(".row").eq(i).append('<div class="col" x="' + j + '">');
      }
    }
    // change width and height of squares proportional to window height
    $(".row").css("height", "calc(75vh / " + size + ")");
    $(".col").css({"width": "calc(100% / " + size + ")",
                  "height": "calc(75vh / " + size + ")",
                  "line-height": "calc(75vh / " + size + ")"});
    // create player info
    $("#container").append('<div class="playerBar"');
    return {
      setSquare: function(move, piece){
          $('.row').eq(move.y).find('.col').eq(move.x).text(piece); // Updates the GUI's board's grid to keep them in sync
      }
    };
  },
  game: function(boardSize, nInARow){
    var g = tictactoe.game(boardSize, nInARow);
    g.play = function(){
      $(".col").on("click", function(){
        var move = {
          y: $(this).closest(".row").attr("y"),
          x: $(this).attr("x")
        };
        console.log(move);
        if (g.makeMove(move)){
          g.webBoard.setSquare(move, g.curPlayer.piece);
          g.board.show();
          var gameState = g.gameState(move);
          if (gameState === g.PLAY){
              g.curPlayer = g.getNextPlayer();
          }else{
            if (gameState === g.WINNER){
              $("#container").append(g.curPlayer.name + " has WON<br>");
              var otherPlayer = g.getNextPlayer();
              $("#container").append(g.curPlayer.name + ":" + g.curPlayer.score + "<br>" + otherPlayer.name + ":" + otherPlayer.score);
              console.log(g.curPlayer.name + " has won", g.curPlayer.score);
            }else{
              $("#container").append("DRAW");
              console.log("DRAW");
            }
            $('.col').off('click');
          }
        }
      });
    };
    g.webBoard = webGui.board(boardSize); // Purely for updating the DOM board
    return g;
  }
};

$(document).ready(function(){
    // get grid size and n in a row
    // start a new game
    var game = null;
    $('form').submit(function(event){
      event.preventDefault();
      var gridSize = $('#gridSize').val() || 3;
      var nInARow = $('#nInARow').val() || 3;
      var p1Name = $('#player1Name').val() || "player 1";
      var p2Name = $('#player2Name').val() || "player 2";
      console.log('forming ',gridSize,nInARow);
      game = webGui.game(gridSize, nInARow);
      game.addPlayer(tictactoe.player(p1Name, 'x'));
      game.addPlayer(tictactoe.player(p2Name, 'o'));
      game.play();
    });

    $('#reset').on('click', function(){
      if (game){
        var gridSize = $('#gridSize').val() || 3;
        var nInARow = $('#nInARow').val() || 3;
        game.reset(gridSize, nInARow);    // reset in-memory board, players retained
        game.webBoard = webGui.board(gridSize); // reset dom board
        game.play();
      }
    });
});