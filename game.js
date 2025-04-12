let boardBound, activePiece, clickedSquare, boardStatus, pieceObj;
const chessBoard = document.getElementById("chessBoard");

window.addEventListener("load", () => {
setBoardStat();
boardLocate();
});
window.addEventListener("resize", () => {
setBoardStat();
boardLocate();
});

function setPieceType(name, obj){
    switch (name) {
        case "wp":case "bp":obj = new Pawn(obj);break;
        case "wr":case "br":obj = new Rook(obj);break;
        case "wn":case "bn":obj = new Knight(obj);break;
        case "wb":case "bb":obj = new Bishop(obj);break;
        case "wq":case "bq":obj = new Queen(obj);break;
        case "wk":case "bk":obj = new King(obj);break;
        default: obj = new Piece(obj);
    }
    return obj;
}

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
    let x = parseInt(piece.dataset.x);
    let y = parseInt(piece.dataset.y);
    let name = [...piece.classList].find((cls) =>
    /^(w|b)[kqrbnp]$/.test(cls)
    );
    // const id = piece.id;
    let color = name[0];
    // console.log(x, y, color);
    pieceObj = new Piece(x, y, color);
    // console.log(pieceObj)
    pieceObj = setPieceType(name, pieceObj);
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
movePiece(id) {
        const piece = document.getElementById(id); 
        piece.dataset.x = clickedSquare.x;
        piece.dataset.y = clickedSquare.y;
        setBoardStat();
}
}

class Pawn extends Piece {
    constructor(pieceObj) {
        super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
    }
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
    constructor(pieceObj) {
        super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
    }
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
    constructor(pieceObj) {
        super(pieceObj.pos.x, pieceObj.pos.y, pieceObj.color);
    }
findMoves() {
    this.moves = [];
    // make one fucntion and pass directbions in it instead of doing 8 fucking for loops.

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
        boardStatus[i][j].targeted === this.color
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
        activePiece = boardStatus[clickedSquare.x][clickedSquare.y];
        calcMoves();
        showMoves();
    }else{
        activePiece = null;
    }
}

function showMoves() {
    // css update later
    console.log("Possible Moves:", JSON.stringify(activePiece.moves));
}

function moveCheck(){
    if((activePiece.moves.some(move => move[0] === clickedSquare.x && move[1] === clickedSquare.y))){
        const obj = new Piece(clickedSquare.x, clickedSquare.y, activePiece.color);
        pieceObj = setPieceType(activePiece.name, obj);
        pieceObj.movePiece(activePiece.id);
    }
}

chessBoard.addEventListener("click", (event) => {
    clickLocate(event);
    console.log(clickedSquare.x, clickedSquare.y);
    statusCheck();
});
