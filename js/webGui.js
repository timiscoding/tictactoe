console.log("webGui");

var webGui = {
  formGenerator: function(settings, newLine){ // generates a form in html based on an array specifying the order and elements needed. 'newLine' creates <p> tags on each element
    var g = '<label for="gridSize">Grid size</label><input id="gridSize" type="number" value="3"/>';
    var niar = '<label for="nInARow">N-in-a-row</label><input id="nInARow" type="number" value="3"/>';
    var p1n = '<label for="player1Name">Player 1 name</label><input id="player1Name" type="text" placeholder="Player 1"/>';
    var p1a = '<label for="player1Avatar">Player 1 avatar URL</label><input id="player1Avatar" type="text" placeholder="X"/>';
    var p2n = '<label for="player2Name">Player 2 name</label><input id="player2Name" type="text" placeholder="Player 2"/>';
    var p2a = '<label for="player2Avatar">Player 2 avatar URL</label><input id="player2Avatar" type="text" placeholder="O"/>';
    var ng = '<button id="newGame">New game</button>';
    var rg = '<button id="resetGame">Reset game</button>';
    var s = '<button id="settings">settings</button>';
    var str = "<form>\n";
    for (var i=0; i < settings.length; i++){
      var element = settings[i];
      if (newLine && element !== 'ng' && element !== 'rg'){
        str += "<p>" + eval(element) + '</p>\n';
      }else{
        str += eval(settings[i]) + '\n';
      }
    }
    return str + '</form>';
  },
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
    var g = tictactoe.game(boardSize, nInARow);
    g.play = function(){ // captures a player clicking a square, validates move, sets the piece on the board and checks game state
      $(".col").on("click", function(){
        var move = {
          y: $(this).closest(".row").attr("y"),
          x: $(this).attr("x")
        };
        if (g.makeMove(move)){
          g.webBoard.setSquare(move, g.curPlayer.avatar || g.curPlayer.piece); // update web board
          g.board.show();
          var gameState = g.gameState(move);
          if (gameState === g.PLAY){
              g.curPlayer = g.getNextPlayer();
              // switch the hand image pointing to the next players turn
              $('#p1 .hand').toggle();
              $('#p2 .hand').toggle();
          }else{
            if (gameState === g.WINNER){
              $('#element_to_pop_up').html(g.curPlayer.name + " has won!").bPopup({modalColor: 'none'});
              var otherPlayer = g.getNextPlayer();
              $("#score").text(g.players[0].score + " : " + g.players[1].score);
            }else{
              $('#element_to_pop_up').html("It's a draw :(").bPopup({modalColor: 'none'});
            }
            $('.col').off('click'); // disable user input because game is over
          }
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

    var p1 = tictactoe.player(p1Name, 'x');
    var p2 = tictactoe.player(p2Name, 'o');
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
      $($form).find('label').each(function(){
        if ($(this).width() > max){
          max = $(this).width();
        }
      });
      $($form).find('label').css("display", "inline-block");
      $($form).find('label').width(max);
  }
};

$(document).ready(function(){
    var game = null;
    var popup = null;
    var $startScreen = $(webGui.formGenerator(['g', 'niar', 'p1n', 'p1a', 'p2n', 'p2a', 'ng'], true)).appendTo('#container');
    $startScreen.css({"width": "70%",
                      "margin": "0 auto"});
    webGui.alignForm($startScreen);
    $('body').on('click', 'button', function(event){
      event.preventDefault();
      var $button = $(this);
      if (!game){ // first game
        game = webGui.resetGame();
        $startScreen.remove();
        $(webGui.formGenerator(['g', 'niar', 'ng', 's'], false)).appendTo('#options');
        $('form').css({"width": "65%",
                      "margin": "1vh auto"});
      }else if ($button.attr('id') === "newGame"){ // resets board, but not player info and scores
        var gridSize = $('#gridSize').val() || 3;
        var nInARow = $('#nInARow').val() || 3;
        game.resetBoard(gridSize, nInARow);    // reset in-memory board, player data retained
        game.webBoard = webGui.board(gridSize); // reset dom board
        $('#p1 .hand').show();
        $('#p2 .hand').hide();
      }else if ($button.attr('id') === "resetGame"){ // resets everything including player info and scores
        game = webGui.resetGame();
        popup.close();
      }else if ($button.attr('id') === "settings"){ // shows settings popup
        var $form = $(webGui.formGenerator(['g', 'niar', 'p1n', 'p1a', 'p2n', 'p2a', 'rg'], true));
        popup = $('#element_to_pop_up').html($form).bPopup({modalColor: 'none'});
        webGui.alignForm($form);
      }
      game.play();
    });
});