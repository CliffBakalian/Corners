// Variables

var SIZE = 5;
var board = new Array(SIZE).fill(new Array(SIZE).fill(0));
var player1 = new Player("Player 1");
var player2 = new Player("Player 2");
var currTurn = 0; // 0 - player1, 1 - player2
var currMove = new Piece(-1, -1, 1, 1); // -1 means move not placed

// Object Constructors

// down left  =  1 ,-1
// down right =  1 , 1
// up left    = -1 ,-1
// up right   = -1 , 1
function Piece(xPos, yPos, xOri, yOri) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.xOri = xOri;
  this.yOri = yOri;
}

function Player(name) {
  this.name = name;
  this.moves = new Array(4).fill(0);
}


// Functions

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  if (data == "placed") {
    ev.target.appendChild(document.getElementById(data));
  } else {
    var copy = document.getElementById(data).cloneNode(true);
    copy.id = "placed";
    ev.target.appendChild(copy);
  }
}

// func returns number of moves available to the player from the given piece
// -1 = no moves available
function moveCount(player, piece) {
  var x = piece.xPos;
  var y = piece.yPos;
  var count = 0;
  while (0 <= x && x < SIZE){
    if (!isOccupied(x, y))
	    count++;
    x += piece.xOri;
  }
  while (0 <= y && y < SIZE){
    if (!isOccupied(x, y))
      count++;
    y += piece.yOri;
  }

  if (x == 0 && y == 0 && player.moves[2] == 0)
    count -= 1;
  if (x == 0 && y == SIZE - 1 && player.moves[1] == 0)
    count -= 1;
  if (x == SIZE - 1 && y == 0 && player.moves[3] == 0)
    count -= 1;
  if (x == SIZE - 1 && y == SIZE - 1 && player.moves[0] == 0)
    count -= 1;
  return count;
}

// true means position IS occupied
function isOccupied(x, y) {
  return board[x][y] != 0;
}

function placePiece(x,y, xOri, yOri) {
  piece = new Piece(x,y, xOri, yOri);
  if (moveCount(piece) != 0){
    board[x][y] = piece;
    return true;
  }
  return false;
}

function start() {
  SIZE = $('input[name=size]:checked').val();
  player1.name = $('#player1').val();
  player2.name = $('#player2').val();
  currTurn = 0;
  clearGrid();
  drawGrid();
  message("It is " + player1.name + "'s turn!");
}

function clearGrid() {
  $('.game-grid > span').remove();
}

function drawGrid(){
  var x = 0;
  var y = 0;
  var s = 100 / SIZE + "%";
  var cell = "" + s;
  while (++x < SIZE)
    cell = cell + " " + s;
  $('.game-grid').css("grid-template-columns", cell);
  $('.game-grid').css("grid-template-rows", cell);
  x = 0;
  while (x < SIZE) {
    y = 0;
    while (y < SIZE) {
      var block = document.createElement("SPAN");
      block.id = x + "-" + y;
      block.className = "block";
      block.setAttribute("ondrop", "javascript:drop(event)");
      block.setAttribute("ondragover", "javascript:allowDrop(event)");
      document.getElementById("game-grid").appendChild(block);
      y++;
    }
    x++;
  }
  // $('.draw-form').css("display", "none
  // set disabled to yes?
}

function message(message) {
  $('.messages').text(message);
}

function submitMove() {
  message("Checking...");
  if (currMove.xPos == -1 || currMove.yPos == -1) {
    message("You must place a piece first!");
  } else if (isOccupied(currMove.xPos, currMove.yPos)) {
    message("Position is occupied, choose a different spot!");
  } else {
    
  }
  // reset current move
  currMove.xPos = -1;
  currMove.yPos = -1;
}
