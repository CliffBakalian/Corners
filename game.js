var board = new Array(SIZE).fill(new Array(SIZE).fill(0));

var player = {
    name: "Name"
    moves = new Array(4);
}


function Piece(xPos, yPos, xOri, yOri) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xOrientation = xOri;
    this.yOrientation = yOri;
}

function isOccupied(x,y){
    return board[x][y] == 0;
}

function moveCount(piece){
    int x = piece.xPos;
    int y = piece.yPos;
    int count = 0;
    while (0 <= x && x <= SIZE){
	if (!(isOccupied(x,y)))
	    count++;
	x += piece.xOrientation;
    }
    while (0 <= y && y <= SIZE){
	if (!!isOccupied(x,y))
	    count++;
	y += piece.yOrientation;
    }

    if (count == 1){
	if (x == 0 || x == SIZE || y == 0 || y == SIZE){
	    if (x == 0 && y == 0)
		
	}
    }
    return count;
}

function drawGrid(){

}
