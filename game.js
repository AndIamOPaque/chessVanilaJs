// declaration
let boardBound,
  activePiece,
  activePiecePos,
  clickedSquare,
  boardStatus,
  pieceObj,
  turnBlack = false;
const chessBoard = document.getElementById("chessBoard");

window.addEventListener("load", () => {
  boardLocate();
  setBoardStat();
  calcAllMoves();
});
window.addEventListener("resize", () => {
  boardLocate();
  setBoardStat();
  calcAllMoves();
});

function simulateMove(){

}

function setPieceType(name, obj) {
  switch (name) {
    case "wp":case "bp":obj = new Pawn(obj);break;
    case "wr":case "br":obj = new Rook(obj);break;
    case "wn":case "bn":obj = new Knight(obj);break;
    case "wb":case "bb":obj = new Bishop(obj);break;
    case "wq":case "bq":obj = new Queen(obj);break;
    case "wk":case "bk":obj = new King(obj);break;
    default:obj = new Piece(obj);
  }
  return obj;
}

function updateBoard(piece){
const fromX = parseInt(piece.dataset.x);
const fromY = parseInt(piece.dataset.y);
const toX = clickedSquare.x;
const toY = clickedSquare.y;

boardStatus[toX][toY] = { ...boardStatus[fromX][fromY] };
boardStatus[fromX][fromY] = { empty: true };


piece.dataset.x = toX;
piece.dataset.y = toY;
piece.style.gridColumnStart = toX + 1;
piece.style.gridRowStart = toY + 1;
}

function setBoardStat() {
  boardStatus = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ empty: true }))
  );

  document.querySelectorAll(".piece").forEach((piece) => {
    let x = parseInt(piece.dataset.x);
    let y = parseInt(piece.dataset.y);
    let name = [...piece.classList].find((cls) => /^(w|b)[kqrbnp]$/.test(cls));
    let id = piece.id;
    let color = name[0];
    boardStatus[x][y] = { name: name, id: id, color: color, empty: false };
    piece.style.gridColumnStart = x + 1;
    piece.style.gridRowStart = y + 1;
  });
}

function setTarget(i, j, col){
  const currentTarget = boardStatus[i][j].targeted;
  if (typeof currentTarget === "undefined") {
    boardStatus[i][j].targeted = col;
  } else if (currentTarget !== col && currentTarget !== "wb") {
    boardStatus[i][j].targeted = "wb";
  }
}

function calcAllMoves() {

  for(x=0;x<8;x++){
    for(y=0;y<8;y++){
      // delete boardStatus[x][y].targeted;
      if(!boardStatus[x][y].empty){    
        let name = boardStatus[x][y].name;
        let color = name[0];
        pieceObj = new Piece(x, y, color);
        pieceObj = setPieceType(name, pieceObj);
        pieceObj.findMoves();
        // to fix target
        if(name[1] == "p"){
          let j = y + pieceObj.step; 
          if(j< 8 && j >= 0){
            if(x + 1 < 8){setTarget(x+1, j, color)}
            if(x - 1 >= 0){setTarget(x-1, j, color)}
          }
        }
        else{
        pieceObj.moves.forEach(([i, j]) => {
            setTarget(i, j, color);
        });}
        boardStatus[x][y].moves = pieceObj.moves;
      }
    }
  }
}

function boardLocate() {
  boardBound = chessBoard.getBoundingClientRect();
}

function clickLocate(event) {
  clickedSquare = {
    x: Math.floor(((event.clientX - boardBound.left) / boardBound.width) * 8),
    y: Math.floor(((event.clientY - boardBound.top) / boardBound.height) * 8),
  };
}

// Pieces
class Piece {
  pos = { x: null, y: null };
  color;
  moves = [];
  constructor(i, j, col) {
    this.pos.x = i;
    this.pos.y = j;
    this.color = col;
  }
  findMoves() {}
  exploreDirections(directions) {
    for (const [dx, dy] of directions) {
      let i = this.pos.x + dx;
      let j = this.pos.y + dy;
      while (i >= 0 && i < 8 && j >= 0 && j < 8) {
        if (boardStatus[i][j].empty) {
          this.moves.push([i, j]);
        } else {
          if (boardStatus[i][j].color !== this.color) {
            this.moves.push([i, j]);
          }
          break;
        }
        i += dx;
        j += dy;
      }
    }
  }

  movePiece(id) {
    const piece = document.getElementById(id);
    updateBoard(piece);
    calcAllMoves();
    activePiece = null;
    turnBlack = !turnBlack;
  }
}

class Pawn extends Piece {
  step;
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
    
    // Set step based on color
    this.step = this.color === "b" ? 1 : -1;
  }

  findMoves() {
    let start = false;

    if (this.color === "b") {
      if (this.pos.y === 1) start = true;
    } else {
      if (this.pos.y === 6) start = true;
    }

    this.moves = [];

    // Move forward one step
    if (
      this.pos.y + this.step < 8 &&
      this.pos.y + this.step >= 0 &&
      boardStatus[this.pos.x][this.pos.y + this.step].empty
    ) {
      this.moves.push([this.pos.x, this.pos.y + this.step]);

      // Move forward two steps from start position
      if (
        start &&
        boardStatus[this.pos.x][this.pos.y + 2 * this.step].empty
      ) {
        this.moves.push([this.pos.x, this.pos.y + 2 * this.step]);
      }
    }

    // Capture diagonally to the right
    if (
      this.pos.x + 1 < 8 &&
      this.pos.y + this.step >= 0 &&
      this.pos.y + this.step < 8 &&
      !boardStatus[this.pos.x + 1][this.pos.y + this.step].empty &&
      boardStatus[this.pos.x + 1][this.pos.y + this.step].color !== this.color
    ) {
      this.moves.push([this.pos.x + 1, this.pos.y + this.step]);
    }

    // Capture diagonally to the left
    if (
      this.pos.x - 1 >= 0 &&
      this.pos.y + this.step >= 0 &&
      this.pos.y + this.step < 8 &&
      !boardStatus[this.pos.x - 1][this.pos.y + this.step].empty &&
      boardStatus[this.pos.x - 1][this.pos.y + this.step].color !== this.color
    ) {
      this.moves.push([this.pos.x - 1, this.pos.y + this.step]);
    }
  }
}

class Rook extends Piece {
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
  }

  findMoves() {
    this.moves = [];
    const rookDirs = [
      [1, 0], // down
      [-1, 0], // up
      [0, 1], // right
      [0, -1], // left
    ];
    this.exploreDirections(rookDirs);
  }
}

class Knight extends Piece {
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
  }
  findMoves() {
    const moves = [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ];
    moves.forEach(([dx, dy]) => {
      let i = this.pos.x + dx;
      let j = this.pos.y + dy;
      if (i < 8 && j < 8 && i >= 0 && j >= 0) {
        if (boardStatus[i][j].empty) {
          this.moves.push([i, j]);
        } else if (boardStatus[i][j].color != this.color) {
          this.moves.push([i, j]);
        }
      }
    });
  }
}

class Bishop extends Piece {
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
  }

  findMoves() {
    this.moves = [];
    const bishopDirs = [
      [1, 1], // down-right
      [-1, 1], // up-right
      [1, -1], // down-left
      [-1, -1], // up-left
    ];
    this.exploreDirections(bishopDirs);
  }
}

class Queen extends Piece {
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
  }

  findMoves() {
    this.moves = [];
    const queenDirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1], // Rook-like
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1], // Bishop-like
    ];
    this.exploreDirections(queenDirs);
  }
}

class King extends Piece {
  constructor(pieceObj) {
    super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
  }
  findMoves() {
    this.moves = [];
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1], // vertical and horizontal
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1], // diagonals
    ];

    directions.forEach(([dx, dy]) => {
      const i = this.pos.x + dx;
      const j = this.pos.y + dy;
      if (i >= 0 && i < 8 && j >= 0 && j < 8) {
        if (
          (boardStatus[i][j].empty || boardStatus[i][j].color !== this.color) &&
          (boardStatus[i][j].targeted === this.color || !(boardStatus[i][j].targeted))
        ) {
          this.moves.push([i, j]);
        }
      }
    });

    // Optionally: Add castling logic here later
  }
}

function statusCheck() {
  if (!boardStatus[clickedSquare.x][clickedSquare.y].empty) {
    activePiecePos = { x: clickedSquare.x, y: clickedSquare.y };
    activePiece = boardStatus[clickedSquare.x][clickedSquare.y];
    calcAllMoves();
    showMoves();
  } else {
    activePiece = null;
  }
}

function showMoves() {
  // css update later
  console.log("Possible Moves:", JSON.stringify(activePiece.moves));
}

function tryMove() {  
  if (
    activePiece.moves.some(
      (move) => move[0] === clickedSquare.x && move[1] === clickedSquare.y
    )
  ) {
    let pieceObj = new Piece(
      activePiecePos.x,
      activePiecePos.y,
      activePiece.color
    );
    pieceObj = setPieceType(activePiece.name, pieceObj);
    if((turnBlack && pieceObj.color == "b")|| (!turnBlack && pieceObj.color == "w")){
        if(!boardStatus[clickedSquare.x][clickedSquare.y].empty){
            document.getElementById(boardStatus[clickedSquare.x][clickedSquare.y].id).className = "captured";
            boardStatus[clickedSquare.x][clickedSquare.y] = { empty : true};
        }
        pieceObj.movePiece(activePiece.id);
    }
  }else if(!(boardStatus[clickedSquare.x][clickedSquare.y].empty)){
    statusCheck();
  }else{
    activePiece = null;
  }
}

chessBoard.addEventListener("click", (event) => {
  clickLocate(event);
  console.log(clickedSquare.x, clickedSquare.y);
  console.log("Targeted by :", boardStatus[clickedSquare.x][clickedSquare.y].targeted);
  if (activePiece) {
    tryMove();
  } else {
    statusCheck();
  }
});