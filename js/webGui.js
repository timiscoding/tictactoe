console.log("webGui");

var webGui = {
  popup: null,
  formGenerator: function(settings, newLine){
    var g = '<label for="gridSize">Grid size</label><input id="gridSize" type="number" value="3"/>';
    var niar = '<label for="nInARow">N-in-a-row</label><input id="nInARow" type="number" value="3"/>';
    var p1n = '<label for="player1Name">Player 1 name</label><input id="player1Name" type="text" placeholder="Player 1"/>';
    var p1a = '<label for="player1Avatar">Player 1 avatar URL</label><input id="player1Avatar" type="text" placeholder="X"/>';
    var p2n = '<label for="player2Name">Player 2 name</label><input id="player2Name" type="text" placeholder="Player 2"/>';
    var p2a = '<label for="player2Avatar">Player 2 avatar URL</label><input id="player2Avatar" type="text" placeholder="O"/>';
    var ng = '<button id="newGame">New game</button>';
    var rg = '<button id="resetGame">Reset game</button>';
    var s = '<button id="settings">settings</button>';
    // var rg = '<button id="reset">Reset</button>';
    var str = "<form>\n";
    for (var i=0; i < settings.length; i++){
      var element = settings[i];
      if (newLine && (element !== 'ng' || element !== 'rg')){
        str += "<p>" + eval(element) + '</p>\n';
      }else{
        str += eval(settings[i]) + '\n';
      }
    }
    return str + '</form>';
  },
  board: function(size){
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
    // create player info
    // $("#container").append('<div class="playerBar"');
    return {
      setSquare: function(move, piece){
          $('.row').eq(move.y).find('.col').eq(move.x).html(piece); // Updates the GUI's board's grid to keep them in sync
      }
    };
  },
  createGame: function(boardSize, nInARow){
    var g = tictactoe.game(boardSize, nInARow);
    g.play = function(){
      $(".col").on("click", function(){
        var move = {
          y: $(this).closest(".row").attr("y"),
          x: $(this).attr("x")
        };
        console.log(move);
        if (g.makeMove(move)){
          g.webBoard.setSquare(move, g.curPlayer.avatar || g.curPlayer.piece);
          g.board.show();
          var gameState = g.gameState(move);
          if (gameState === g.PLAY){
              g.curPlayer = g.getNextPlayer();
          }else{
            if (gameState === g.WINNER){
              // $("#container").append(g.curPlayer.name + " has WON<br>");
              $('#element_to_pop_up').html(g.curPlayer.name + " has won!").bPopup({modalColor: 'none'});
              var otherPlayer = g.getNextPlayer();
              // $("#container").append(g.curPlayer.name + ":" + g.curPlayer.score + "<br>" + otherPlayer.name + ":" + otherPlayer.score);
              $("#score").text(g.players[0].score + " : " + g.players[1].score);
              console.log(g.curPlayer.name + " has won", g.curPlayer.score);
            }else{
              // $("#container").append("DRAW");
              $('#element_to_pop_up').html("It's a draw :(").bPopup({modalColor: 'none'});
              console.log("DRAW");
            }
            $('.col').off('click');
          }
        }
      });
    };
    g.webBoard = webGui.board(boardSize); // Purely for updating the DOM board
    return g;
  },
  playerSetup: function(){
    var p1Name = $('#player1Name').val() || "player 1";
    var p2Name = $('#player2Name').val() || "player 2";
    $('#playerBar #p1 .name').text(p1Name);
    $('#playerBar #p2 .name').text(p2Name);
    // console.log("playerbar p1 name: " + $('#playerBar #p1 .name').text());
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
  resetGame: function(){
    var gridSize = $('#element_to_pop_up #gridSize').val() || $('#gridSize').val() || 3;
    var nInARow = $('#element_to_pop_up #nInARow').val() || $('#nInARow').val() || 3;
    console.log('gridsize', gridSize, 'nInARow', nInARow);
    var game = webGui.createGame(gridSize, nInARow);
    var players = webGui.playerSetup();
    game.addPlayer(players[0]);
    game.addPlayer(players[1]);
    // console.log("wtf",game.players[0].score, game.players[1].score);
    $("#score").text("0 : 0");
    return game;
  },
  displayForm: function(){
      // var $form = $(formStr).appendTo(toElement);
      var max = 0;
      $('label').each(function(){
        if ($(this).width() > max){
          max = $(this).width();
        }
      });
      console.log('max ', max);
      $('label').css("display", "inline-block");
      $('label').width(max);
      // return $form;
  }
};

$(document).ready(function(){
    // console.log(webGui.formGenerator(['g', 'niar']));
    var game = null;
    // console.log('form: ' + webGui.form);
    var $startScreen = $(webGui.formGenerator(['g', 'niar', 'p1n', 'p1a', 'p2n', 'p2a', 'ng'], true)).appendTo('#container');
    webGui.displayForm();
    $('body').on('click', 'button', function(event){
      event.preventDefault();
      var $button = $(this); //.find('input[type="submit"]');
      console.log('button', $button);
      if (!game){ // first game
        game = webGui.resetGame();
        $startScreen.remove();
        $(webGui.formGenerator(['g', 'niar', 'ng', 's'], false)).appendTo('#options');
        console.log('first game', webGui.formGenerator(['g', 'niar', 'ng']));
      }else if ($button.attr('id') === "newGame"){
        // resets board, but not player info and scores
        console.log('form found new game');
        var gridSize = $('#gridSize').val() || 3;
        var nInARow = $('#nInARow').val() || 3;
        game.resetBoard(gridSize, nInARow);    // reset in-memory board, player data retained
        game.webBoard = webGui.board(gridSize); // reset dom board
      }else if ($button.attr('id') === "resetGame"){
        // resets everything including player info and scores
        console.log('form found reset game');
        game = webGui.resetGame();
        webGui.popup.close();
      }else if ($button.attr('id') === "settings"){
        webGui.popup = $('#element_to_pop_up').html(webGui.formGenerator(['g', 'niar', 'p1n', 'p1a', 'p2n', 'p2a', 'rg'], true)).bPopup({modalColor: 'none'});
        webGui.displayForm();
        console.log(webGui.popup);
      }
      game.play();
    });
});