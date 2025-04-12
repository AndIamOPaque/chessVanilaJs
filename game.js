let boardBound;
window.addEventListener("load", () => {
  setBoardStat();
  boardLocate();
});
window.addEventListener("resize", () => {
  setBoardStat();
  boardLocate();
});

let clickedSquare;
let boardStatus;
let pieceObj;
const chessBoard = document.getElementById("chessBoard");

function setBoardStat() {
  boardStatus = Array(8)
    .fill({ empty: true ,})
    .map(() => Array(8).fill({ empty: true }));
  document.querySelectorAll(".piece").forEach((piece) => {
    const x = parseInt(piece.dataset.x);
    const y = parseInt(piece.dataset.y);
    const name = [...piece.classList].find((cls) =>
      /^(w|b)[kqrbnp]$/.test(cls)
    );
    const id = piece.id;
    const color = name[0];
    boardStatus[x][y] = { name: name, id: id, color: color, empty: false };
    piece.style.gridColumnStart = x + 1;
    piece.style.gridRowStart = y + 1;
  });
}
function calcMoves(){
  document.querySelectorAll(".piece").forEach((piece) => {
    const x = parseInt(piece.dataset.x);
    const y = parseInt(piece.dataset.y);
    const name = [...piece.classList].find((cls) =>
      /^(w|b)[kqrbnp]$/.test(cls)
    );
    // const id = piece.id;
    const color = name[0];
    pieceObj = new Piece(x, y, color);
    switch (name) {
      case "wp":case "bp":pieceObj = new Pawn(x, y, color);break;
      case "wr":case "br":pieceObj = new Rook(x, y, color);break;
      case "wn":case "bn":pieceObj = new Knight(x, y, color);break;
      case "wb":case "bb":pieceObj = new Bishop(x, y, color);break;
      case "wq":case "bq":pieceObj = new Queen(x, y, color);break;
      case "wk":case "bk":pieceObj = new King(x, y, color);break;
      default: pieceObj = new Piece(x, y, color);
    }
    pieceObj.findMoves();
    // console.log(pieceObj);
    // to fix target

    pieceObj.moves.forEach(([i, j]) => {
      if (name[1] == "p" && x == i) {
      } //doing nothing for straight moves of pawn as they can not target straight
      else {
        const currentTarget = boardStatus[i][j].targeted;
        if (typeof currentTarget === "undefined") {
          boardStatus[i][j].targeted = color;
        } else if (currentTarget !== color && currentTarget !== "wb") {
          boardStatus[i][j].targeted = "wb";
        }
      }
    });
    boardStatus[x][y].moves = pieceObj.moves;
  });
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
  movePiece() {
    // if 
    // setBoardStat();
  }
}

class Pawn extends Piece {
  findMoves() {
    let step,
      start = false;
    if (this.color === "b") {
      step = 1;
      if (this.pos.y == 1) {
        start = true;
      }
    } else {
      if (this.pos.y == 6) {
        start = true;
      }
      step = -1;
    }
    this.moves = [];
    if (boardStatus[this.pos.x][this.pos.y + step].empty) {
      this.moves.push([this.pos.x, this.pos.y + step]);
      if (start && boardStatus[this.pos.x][this.pos.y + 2 * step].empty) {
        this.moves.push([this.pos.x, this.pos.y + 2 * step]);
      }
    }
    if (
      this.pos.x + 1 < 8 &&
      this.pos.y + step >= 0 &&
      this.pos.y + step < 8 &&
      !boardStatus[this.pos.x + 1][this.pos.y + step].empty &&
      boardStatus[this.pos.x + 1][this.pos.y + step].color !== this.color
    ) {
      this.moves.push([this.pos.x + 1, this.pos.y + step]);
    }

    if (
      this.pos.x - 1 >= 0 &&
      this.pos.y + step >= 0 &&
      this.pos.y + step < 8 &&
      !boardStatus[this.pos.x - 1][this.pos.y + step].empty &&
      boardStatus[this.pos.x - 1][this.pos.y + step].color !== this.color
    ) {
      this.moves.push([this.pos.x - 1, this.pos.y + step]);
    }
  }
}

class Rook extends Piece {
  findMoves() {
    this.moves = [];

    //  Move down (x increases)
    for (let i = this.pos.x + 1; i < 8; i++) {
      if (!boardStatus[i][this.pos.y].empty) {
        if (boardStatus[i][this.pos.y].color !== this.color) {
          this.moves.push([i, this.pos.y]);
        }
        break;
      } else {
        this.moves.push([i, this.pos.y]);
      }
    }

    // Move up (x decreases)
    for (let i = this.pos.x - 1; i >= 0; i--) {
      if (!boardStatus[i][this.pos.y].empty) {
        if (boardStatus[i][this.pos.y].color !== this.color) {
          this.moves.push([i, this.pos.y]);
        }
        break;
      } else {
        this.moves.push([i, this.pos.y]);
      }
    }

    // Move right (y increases)
    for (let j = this.pos.y + 1; j < 8; j++) {
      if (!boardStatus[this.pos.x][j].empty) {
        if (boardStatus[this.pos.x][j].color !== this.color) {
          this.moves.push([this.pos.x, j]);
        }
        break;
      } else {
        this.moves.push([this.pos.x, j]);
      }
    }

    //  Move left (y decreases)
    for (let j = this.pos.y - 1; j >= 0; j--) {
      if (!boardStatus[this.pos.x][j].empty) {
        if (boardStatus[this.pos.x][j].color !== this.color) {
          this.moves.push([this.pos.x, j]);
        }
        break;
      } else {
        this.moves.push([this.pos.x, j]);
      }
    }
  }
}

class Knight extends Piece {
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
  findMoves() {
    this.moves = [];
    let i = this.pos.x + 1;
    let j = this.pos.y + 1;
    while (i < 8 && j < 8) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i++, j++;
    }
    i = this.pos.x - 1;
    j = this.pos.y + 1;
    while (i >= 0 && j < 8) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i--, j++;
    }
    i = this.pos.x + 1;
    j = this.pos.y - 1;
    while (i < 8 && j >= 0) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i++, j--;
    }
    i = this.pos.x - 1;
    j = this.pos.y - 1;
    while (i >= 0 && j >= 0) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i--, j--;
    }
  }
}

class Queen extends Piece {
  findMoves() {
    this.moves = [];

    //  Move down (x increases)
    for (let i = this.pos.x + 1; i < 8; i++) {
      if (!boardStatus[i][this.pos.y].empty) {
        if (boardStatus[i][this.pos.y].color !== this.color) {
          this.moves.push([i, this.pos.y]);
        }
        break;
      } else {
        this.moves.push([i, this.pos.y]);
      }
    }

    // Move up (x decreases)
    for (let i = this.pos.x - 1; i >= 0; i--) {
      if (!boardStatus[i][this.pos.y].empty) {
        if (boardStatus[i][this.pos.y].color !== this.color) {
          this.moves.push([i, this.pos.y]);
        }
        break;
      } else {
        this.moves.push([i, this.pos.y]);
      }
    }

    // Move right (y increases)
    for (let j = this.pos.y + 1; j < 8; j++) {
      if (!boardStatus[this.pos.x][j].empty) {
        if (boardStatus[this.pos.x][j].color !== this.color) {
          this.moves.push([this.pos.x, j]);
        }
        break;
      } else {
        this.moves.push([this.pos.x, j]);
      }
    }

    //  Move left (y decreases)
    for (let j = this.pos.y - 1; j >= 0; j--) {
      if (!boardStatus[this.pos.x][j].empty) {
        if (boardStatus[this.pos.x][j].color !== this.color) {
          this.moves.push([this.pos.x, j]);
        }
        break;
      } else {
        this.moves.push([this.pos.x, j]);
      }
    }
    let i = this.pos.x + 1;
    let j = this.pos.y + 1;
    while (i < 8 && j < 8) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i++, j++;
    }
    i = this.pos.x - 1;
    j = this.pos.y + 1;
    while (i >= 0 && j < 8) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i--, j++;
    }
    i = this.pos.x + 1;
    j = this.pos.y - 1;
    while (i < 8 && j >= 0) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i++, j--;
    }
    i = this.pos.x - 1;
    j = this.pos.y - 1;
    while (i >= 0 && j >= 0) {
      if (boardStatus[i][j].empty) {
        this.moves.push([i, j]);
      } else if (boardStatus[i][j].color != this.color) {
        this.moves.push([i, j]);
      } else {
        break;
      }
      i--, j--;
    }
  }
}

class King extends Piece {
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
          boardStatus[i][j].targeted === this.color
        ) {
          this.moves.push([i, j]);
        }
      }
    });

    // Optionally: Add castling logic here later
  }
}

let activePiece = new Piece();
let activeSquare = null;

function statusCheck() {
  activeSquare = boardStatus[clickedSquare.x][clickedSquare.y];
  if (!activeSquare.empty) {
    calcMoves();
    showMoves();
  }
}
function showMoves() {
  // css update later
  console.log("Possible Moves:", JSON.stringify(activeSquare.moves));
}

chessBoard.addEventListener("click", (event) => {
  setBoardStat();
  clickLocate(event);
  console.log(clickedSquare.x, clickedSquare.y);
  statusCheck();
});
