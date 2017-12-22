// Variables

var SIZE = 5;
var board = [];
var player1 = new Player("Player 1", "#7575FF", false);
var player2 = new Player("Player 2", "#FF7575", false);
var currTurn = 0; // 0 - player1, 1 - player2
var currMove = new Piece(-1, -1, 1, 1); // -1 means move not placed
var prevMoves = []; // will hold past 2 moves (in order), [0] = player1, [1] = player2 (we can implement a 2d array here for possible undo-ing)
var firstMove = true;
var dragIcon = new Image();
var running = false;

// Constructors

// Orientations:
// right down =  1 , 1  0 - piece1
// right up   =  1 ,-1  1 - piece2
// left down  = -1 , 1  2 - piece3
// left up    = -1 ,-1  3 - piece4
function Piece(xPos, yPos, xOri, yOri) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.xOri = xOri;
  this.yOri = yOri;
}

function Player(name, color, cpu) {
  this.name = name;
  this.moves = [0, 0, 0, 0]; // 1 means move has been done
  this.color = color;
  this.lightColor = "rgba(" + parseInt(color.substring(1,3), 16) + "," + parseInt(color.substring(3,5), 16) + "," + parseInt(color.substring(5,7), 16) + ",0.25)";
  this.cpu = cpu; // true or false
}

// Functions

function drag(ev, xOri, yOri) {
  dragIcon.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/220px-Circle_-_black_simple.svg.png";
  dragIcon.width = 50;
  ev.dataTransfer.setDragImage(dragIcon, 100, 100); // change later
  ev.dataTransfer.setData("data", ev.target.id);
  ev.dataTransfer.setData("xOri", xOri);
  ev.dataTransfer.setData("yOri", yOri);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev, ele) {
  ev.preventDefault();
  var newPos = ele.id.split("-");
  var x = parseInt(newPos[0]);
  var y = parseInt(newPos[1]);
  if (!isOccupied(x, y)) {
    var child;
    var data = ev.dataTransfer.getData("data");
    var oldPos = [currMove.xPos, currMove.yPos];
    var oldOri = [currMove.xOri, currMove.yOri];
    currMove.xPos = x;
    currMove.yPos = y;
    currMove.xOri = parseInt(ev.dataTransfer.getData("xOri"));
    currMove.yOri = parseInt(ev.dataTransfer.getData("yOri"));
    if (oldPos[0] == -1 || oldPos[1] == -1) {
      child = document.getElementById(data).cloneNode(true);
      child.id = "placed";
    } else if (oldPos[0] == currMove.xPos && oldPos[1] == currMove.yPos) {
      // remove old piece
      document.getElementById(oldPos[0] + '-' + oldPos[1]).firstChild.remove(this);
      // set new piece
      child = document.getElementById(data).cloneNode(true);
    } else if (data != "placed") { // there is something wrong here ?????????????????????
      // remove old piece
      document.getElementById(oldPos[0] + '-' + oldPos[1]).firstChild.remove(this);
      // set new piece
      child = document.getElementById(data).cloneNode(true);
    } else {
      child = document.getElementById(data);
    }
    // place piece
    child.id = "placed";
    ele.appendChild(child);
  }
}

// func returns number of moves available to the player from the given piece
// -1 = no moves available
function moveCount(player, piece) {
  var x = piece.xPos;
  var y = piece.yPos;
  var count = 0;
  // checks every move
  while (0 <= x && x < SIZE) {
    if (!isOccupied(x, y))
	    count++;
    x += piece.xOri;
  }
  x = piece.xPos;
  while (0 <= y && y < SIZE) {
    if (!isOccupied(x, y))
      count++;
    y += piece.yOri;
  }
  // checks the 4 illegal corners
  if (x == 0 && y == 0 && player.moves[2] == 0) // piece 3
    count -= 1;
  if (x == 0 && y == SIZE - 1 && player.moves[1] == 0) // piece 2
    count -= 1;
  if (x == SIZE - 1 && y == 0 && player.moves[3] == 0) // piece 4
    count -= 1;
  if (x == SIZE - 1 && y == SIZE - 1 && player.moves[0] == 0) // piece 1
    count -= 1;
  return count;
}

// returns true if piece is illegally in a corner
function cornerCheck(piece) {
  var x = piece.xPos;
  var y = piece.yPos;
  var p = piece.xOri;
  var q = piece.yOri;
  return  (x == 0 && y == 0 && p == -1 && q == -1) ||
          (x == 0 && y == SIZE - 1 && p == -1 && q == 1) ||
          (x == SIZE - 1 && y == 0 && p == 1 && q == -1) ||
          (x == SIZE - 1 && y == SIZE - 1 && p == 1 && q == 1);
}

// true means position IS occupied
function isOccupied(x, y) {
  return board[x][y] != 0;
}

// clears all spans from the grid
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
      block.id = y + "-" + x;
      block.className = "block";
      block.setAttribute("ondrop", "javascript:drop(event, this)");
      block.setAttribute("ondragover", "javascript:allowDrop(event)");
      document.getElementById("game-grid").appendChild(block);
      y++;
    }
    x++;
  }
}

// handles messages at the top of the game board
function message(message) {
  $('#messages').text(message);
}

function submitMove() {
  message("Checking...");
  if (currMove.xPos == -1 || currMove.yPos == -1) {
    message("You must place a piece first!");
  } else if (isOccupied(currMove.xPos, currMove.yPos)) {
    message("Position is occupied, choose a different spot!");
  } else if (cornerCheck(currMove)) {
    message("Illegal corner move!");
  } else {
    var flag = 1;
    if (firstMove) {
      // first move must be placed in the center
      var center = Math.floor(SIZE / 2);
      if (currMove.xPos != center && currMove.yPos != center) {
        flag = 0;
        message("First move must be placed in the center!");
      }
    }
    if (flag == 1) {
      // make sure move is valid
      var found = 0;
      if (firstMove) {
        firstMove = false;
        found = 1;
      } else {
        var move = prevMoves[1 - currTurn];
        if (!(move == 0 && currTurn == 0)) {
          var x = move.xPos;
          var y = move.yPos;
          var o = move.xOri;
          var cx = currMove.xPos;
          var cy = currMove.yPos;
          while (x >= 0 && x < SIZE) {
            if (x == cx && y == cy)
              found = 1;
            x += o;
          }
          x = move.xPos;
          o = move.yOri;
          while (0 <= y && y < SIZE) {
            if (x == cx && y == cy)
              found = 1;
            y += o;
          }
        }
      }
      if (found == 0) {
        message("Invalid move!");
      } else {
        // put piece on the board
        board[currMove.xPos][currMove.yPos] = new Piece(currMove.xPos, currMove.yPos, currMove.xOri, currMove.yOri);
        // set draggable of placed move to false
        $("#placed").attr("draggable", "false");
        // set ID of placed move
        document.getElementById("placed").id = currMove.xPos + "-" + currMove.yPos + "-placed";
        // remove current move from player moves
        var q = 0;
        if (currMove.xOri == -1)
          q += 2;
        if (currMove.yOri == -1)
          q += 1;
        (currTurn == 0) ? (player1.moves[q] = 1) : (player2.moves[q] = 1);
        // set previous move
        prevMoves[currTurn] = new Piece(currMove.xPos, currMove.yPos, currMove.xOri, currMove.yOri);
        // check moveCount
        if (moveCount((currTurn == 0 ? player1 : player2), currMove) == 0) {
          end(currTurn == 0 ? player1 : player2);
        } else {
          // possibly reset player moves
          var count = 0;
          for (var i = 0; i < 4; i++)
            count += (currTurn == 0 ? player1 : player2).moves[i];
          if (count == 4)
            for (var i = 0; i < 4; i++)
              (currTurn == 0 ? player1 : player2).moves[i] = 0;
          // reset current move
          currMove.xPos = -1;
          currMove.yPos = -1;
          // set next player
          currTurn = 1 - currTurn;
          updateUI();
        }
      }
    }
  }
}

// updates the UI - board, pieces, messages
function updateUI() {
  // send message
  message("It is " + ((currTurn == 0) ? player1.name : player2.name) + "'s turn!");
  // update visibility and draggability of player moves
  for (var i = 0; i < 4; i++) {
    if (player1.moves[i] != 0)
      $("#piece" + (i + 1) + "-0").css("visibility", "hidden");
    else
      $("#piece" + (i + 1) + "-0").css("visibility", "visible");
    if (player2.moves[i] != 0)
      $("#piece" + (i + 1) + "-1").css("visibility", "hidden");
    else
      $("#piece" + (i + 1) + "-1").css("visibility", "visible");
    $("#piece" + (i + 1) + "-" + currTurn).attr("draggable", "true");
    $("#piece" + (i + 1) + "-" + (1 - currTurn)).attr("draggable", "false");
  }
  // put border around current player's pieces
  $("#moves-" + currTurn).css("border", "3px solid " + ((currTurn == 0) ? player1.color : player2.color));
  $("#moves-" + (1 - currTurn)).css("border", "none");
  // display next moves to current player
  $(".block").css("background", "#E5E4F0");
  var piece = prevMoves[1 - currTurn];
  var x = piece.xPos;
  var y = piece.yPos;
  while (0 <= x && x < SIZE) {
    if (!isOccupied(x, y))
	    $("#" + x + "-" + y).css("background", (currTurn == 0 ? player1 : player2).lightColor);
    x += piece.xOri;
  }
  x = piece.xPos;
  while (0 <= y && y < SIZE) {
    if (!isOccupied(x, y))
      $("#" + x + "-" + y).css("background", (currTurn == 0 ? player1 : player2).lightColor);
    y += piece.yOri;
  }
}

// starting point - initializes all of our variables
function start() {
  if (running) {
    message("Are you sure you want to restart?");
    // put more here later
  }
  message("Initializing...");
  // set running state to true
  running = true;
  // set size of game board
  SIZE = $("input[name=size]:checked").val();
  // initialize board depending on size
  for (var i = 0; i < SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < SIZE; j++)
      board[i][j] = 0;
  }
  // reset firstMove
  firstMove = true;
  // reset prevMoves
  prevMoves[0] = 0;
  prevMoves[1] = 0;
  // reset currMove
  currMove.xPos = -1;
  currMove.yPos = -1;
  // reset player moves
  for (var i = 0; i < 4; i++) {
    player1.moves[i] = 0;
    player2.moves[i] = 0;
  }
  // set player names
  player1.name = $("#player1").val();
  player2.name = $("#player2").val();
  // set player colors
  player1.color = $("#color1").val();
  player2.color = $("#color2").val();
  // set player cpu
  player1.cpu = false;
  player2.cpu = false;
  // set player piece colors
  for (var i = 0; i < 4; i++) {
    $("#piece" + (i + 1) + "-0").css("color", player1.color);
    $("#piece" + (i + 1) + "-1").css("color", player2.color);
  }
  // set who's first
  currTurn = $("input[name=first]:checked").val();
  // update computer
  var type = $("input[name=type]:checked").val();
  if (type == 1)
    player2.cpu = true;
  // update the interface
  clearGrid();
  drawGrid();
  updateUI();
}

// ending point - displays the winner
function end(winner) {
  message(winner.name + " has won!");
  running = false;
}
