# Tic Tac Toe

## Technologies

This game was built with:

* HTML/CSS
* Javascript
* jQuery
* bPopup jquery plugin
* Font Awesome

## Features

* Play any NxN size board
* Play N-in-a-row
* Score board keeps track of who's winning
* Customise player names
* Play the game using your favourite picture by supplying a link in the player avatar field. For extra fun, choose the same picture for both players so you have to remember where you put your pieces.
* A hand pointing left or right indicates who's turn it is in case you have a memory of a fish

## Demo

[Play it here](http://timiscoding.github.io/tictactoe)

## Thanks

Thanks to Joel and Jack for helping me out with CSS and design issues. Jack helped me understand my program better and how the web interface synced with my console game.


## Unsolved problems

* When resizing the window, some text spills out of their containers. This is because most of the sizing is done based on viewport height
* The board flows onto the next row if the window width is too small
* Didn't have time to let the player choose a letter as their piece
* Didn't check if player avatars are the same

## Approach taken - you can ignore this part if technical details bore you

### Extensibility

When I first saw the project spec bonuses asking us to make the game playable on any sized board and to make other types of board games, the plan was to design the structure of a simple game to make it as extensible as possible so I chose to object orient the crap out of it. The input would be taken from prompt and the board output to console.log.

The following tables show the object in the heading with the first letter capitalised, methods with brackets, variables as lowercase words and constants in uppercase.

| Board                    | type/return                        | comments
| :----------------------- | :--------------------------------- |
| grid                     | [[]]                               | 2d array storing null, X, or O
| size()                   | number                             | size of N x N board
| show()                   | string                             | print board to console.log
| setSquare(move, piece)   | move={x,y}, piece=string           | given move, sets the square to piece
| getSquare(move)          | move={x,y}, returns null, 'X', 'O' | given move, gets the value of a square
| board(size)              | returns {}                         | creates a new board object of size()

| Player           | type/return | comments
| :--------------- | :----------
| name             | string | name of player
| piece            | string | 'x', 'o'
| score            | number |
| getMove()        | returns {x,y} | prompts player for move and converts it to a move object
| player(name, piece) | returns {} | creates a player object

| Game | type/return | comments
| :----|
| PLAY | -1 | a game state to keep playing
| WINNER | 1 | a game state that a winner has been found
| DRAW | 0 | a game state that a draw has been found
| board | Board | the board for this game
| players | [Player, Player ... ] | array of Player objects
| curPlayer | Player | the current player who will make a move
| nInARow | number | how many pieces needed in a row to win
| moveCount | number | total number of moves made
| addPlayer(player) | Player | adds player to game
| getNextPlayer() | Player | gets the next player in sequence from 'players'
| play() | | game playing loop that gets move, validates it, makes move and checks game state
| makeMove(move) | move={x,y}, returns boolean | places current player's piece on board and updates the move count
| isValidMove(move) | move={x,y}, returns boolean | checks whether a move can be taken
| gameState(move) | move={x,y}, returns PLAY/WINNER/DRAW | check if the game is over or to keep playing
| checkColumn(move) | move={x,y}, returns number | checks how many of current players pieces are in a line from 'move'
| checkRow(move) |
| checkRightDiag(move)
| checkLeftDiag(move)
| getMatches(move, dir) | move={x,y}, dir=string, returns number | Given a direction (N, S, E, W, NE, NW, SE, SW) and a move, it searches starting from 'move' in that direction and returns the number of pieces of the current player in a line
| resetBoard(boardSize, nInARow) | boardSize=number, nInARow=number | resets Game with new board, no players, etc
| game(boardSize, nInARow) | creates a new game object

### Separation of concerns

Separating the basic game from the way the game is displayed makes for a clean design and allows us to mix and match different types of views. The web interface calls most of the same methods as before, creates a HTML/CSS representation of the board and mimics the moves made by the console version. The only exception being the game play flow changes as we are no longer prompting the player for keyboard input but waiting for them to click on squares using event handling.

