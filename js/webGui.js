console.log("webGui");

var webGui = {
  board: function(size){ // create a board on the web page. returns an object allowing you to set a square
    // remove any previous board
    $(".row").remove();
    // create NxN grid
    for (var i=0; i < size; i++){
      $("#board").append('<div class="row" y="' + i + '">');
      for (var j=0; j < size; j++){
        $(".row").eq(i).append('<div class="col" x="' + j + '">');
      }
    }
    // change width and height of squares proportional to window height
    $(".row").css("height", "calc(70vh / " + size + ")");
    $(".col").css({"width": "calc(70vh / " + size + ")",
                  "height": "100%", //calc(75vh / " + size + ")",
                  "line-height": "calc(65vh / " + size + ")",
                  "font-size": "calc(65vh / " + size + ")"});
    return {
      setSquare: function(move, piece){ // set a square on the board with a piece at a position 'move'
          $('.row').eq(move.y).find('.col').eq(move.x).html(piece); // Updates the GUI's board's grid to keep them in sync
      }
    };
  },
  createGame: function(boardSize, nInARow){ // create a new game
    var g = new tictactoe.Game(boardSize, nInARow);
    g.play = function(){ // captures a player clicking a square, validates move, sets the piece on the board and checks if game is over
      var playMove = function(move){
        if (this.makeMove(move)){
          g.webBoard.setSquare(move, g.curPlayer.avatar || g.curPlayer.piece); // update web board
          this.board.show();
          this.state = tictactoe.finalState(move, g.board);
          if (this.state === tictactoe.PLAY){
            this.curPlayer = this.getNextPlayer();
            // switch the hand image pointing to the next players turn
            $('#p1 .hand').toggle();
            $('#p2 .hand').toggle();
          }else{
            if (this.state === tictactoe.WINNER){
              console.log(this.curPlayer.name + " has won");
              $('#element_to_pop_up').html(g.curPlayer.name + " has won!").bPopup({modalColor: 'none'});
              g.curPlayer.score++;
              var otherPlayer = g.getNextPlayer();
              $("#score").text(g.players[0].score + " : " + g.players[1].score);
            }else{
              console.log("DRAW");
              $('#element_to_pop_up').html("It's a draw :(").bPopup({modalColor: 'none'});
            }
            $('.col').off('click'); // disable user input because game is over
          }
          return true;
        }
        return false;
      }.bind(this);
      if (this.curPlayer.ai){ // get AI to move if they are first player
        var move = this.curPlayer.getMove();
        playMove(move);
      }

      $(".col").on("click", function(){
        if (g.curPlayer.ai) { return; }
        var move = {
          y: $(this).closest(".row").attr("y"),
          x: $(this).attr("x"),
          piece: g.curPlayer.piece
        };
        if (!playMove(move)) { // human player made invalid move. eg. clicking on a square already clicked.
          return;
        }
        if (g.state === tictactoe.PLAY && g.curPlayer.ai){ // if next player is AI, get them to move
          var move = g.curPlayer.getMove();
          playMove(move);
        }
      });
    };
    g.webBoard = webGui.board(boardSize); // creates a new web board
    return g;
  },
  playerSetup: function(){ // lifts the settings from the web page and creates new players with those settings
    var p1Name = $('#player1Name').val() || "player 1";
    var p2Name = $('#player2Name').val() || "player 2";
    $('#playerBar #p1 .name').text(p1Name);
    $('#playerBar #p2 .name').text(p2Name);
    var p1AvatarUrl = $('#player1Avatar').val();
    var p2AvatarUrl = $('#player2Avatar').val();

    var p1EnableAI = $('.aiCheckbox:checked').prop('name') === '1';
    var p2EnableAI = $('.aiCheckbox:checked').prop('name') === '2';
    var p1 = new tictactoe.Player(p1Name, p1EnableAI);
    var p2 = new tictactoe.Player(p2Name, p2EnableAI);
    if (p1AvatarUrl){
      p1.avatar = '<img src="' + p1AvatarUrl + '"/>';
      $('#playerBar #p1 .pic').html(p1.avatar);
    }
    if (p2AvatarUrl){
      p2.avatar = '<img src="' + p2AvatarUrl + '"/>';
      $('#playerBar #p2 .pic').html(p2.avatar);
    }
    return [p1, p2];
  },
  resetGame: function(){ // start a new game with new settings & clear the score board
    // when settings popup is open, there are 2 gridSize/nInARow elements, so get the popup
    // value first then fallback to the other one if no popup exists
    var gridSize = $('#element_to_pop_up #gridSize').val() || $('#gridSize').val() || 3;
    var nInARow = $('#element_to_pop_up #nInARow').val() || $('#nInARow').val() || 3;
    var game = webGui.createGame(gridSize, nInARow);
    var players = webGui.playerSetup();
    game.addPlayer(players[0]);
    game.addPlayer(players[1]);
    $("#score").text("0 : 0");
    $('#p1 .hand').show();
    $('#p2 .hand').hide();
    return game;
  },
  alignForm: function($form){ // adjusts the form so that input boxes are horizontally aligned. '$form' must already be in the DOM
      var max = 0;
      $($form).find('.menuLabel').each(function(){
        if ($(this).width() > max){
          max = $(this).width();
        }
      });
      $($form).find('.menuLabel').css("display", "inline-block");
      $($form).find('.menuLabel').width(max);
  }
};

$(document).ready(function(){
    var game = null;
    var popup = null;
    var $startScreen = $( $('#startMenuTemplate').html() ).appendTo('#container');
    webGui.alignForm($startScreen);
    $('body').on('click', 'button', function(event){
      event.preventDefault();
      var $button = $(this);
      if (!game){ // first game
        game = webGui.resetGame();
        $startScreen.remove();
        $('#options').append( $('#gameMenuTemplate').html() );
        game.play();
      }else if ($button.attr('id') === "newGame"){ // resets board, but not player info and scores
        var gridSize = $('#gridSize').val() || 3;
        var nInARow = $('#nInARow').val() || 3;
        game.resetBoard(gridSize, nInARow);    // reset in-memory board, player data retained
        game.webBoard = webGui.board(gridSize); // reset dom board
        $('#p1 .hand').show();
        $('#p2 .hand').hide();
        game.play();
      }else if ($button.attr('id') === "resetGame"){ // resets everything including player info and scores
        game = webGui.resetGame();
        popup.close();
        game.play();
      }else if ($button.attr('id') === "settings"){ // shows settings popup
        var $resetGameMenu = $( $('#resetGameMenuTemplate').html() );
        popup = $('#element_to_pop_up').html($resetGameMenu).bPopup({modalColor: 'none'});
        webGui.alignForm($resetGameMenu);
      }
    });

    $('body').on('change', '.aiCheckbox', function(e){
      // untick other player AI checkbox if it's ticked because we can only have 1 AI player
      $('.aiCheckbox').not(this).prop('checked', false);
    });
});
