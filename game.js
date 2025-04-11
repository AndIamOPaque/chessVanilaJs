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
    let boardStatus = Array(8).fill(null).map(() => Array(8).fill(null));
    const chessBoard = document.getElementById("chessBoard");

    function  setBoardStat(){
    document.querySelectorAll(".piece").forEach((piece) => {
    const x = parseInt(piece.dataset.x); 
    const y = parseInt(piece.dataset.y); 
    const name = [...piece.classList].find(cls =>
        /^(w|b)[kqrbnp]$/.test(cls)
      );      
    const id = piece.id; 
    const color = name[0];
    let pieceObj = new Piece(x, y, color);
    switch (name){
        case "wp": case "bp": pieceObj = new Pawn(x, y, color); break;
        case "wr": case "br": pieceObj = new Rook(x, y, color); break;
        case "wn": case "bn": pieceObj = new Knight(x, y, color); break;
        case "wb": case "bb": pieceObj = new Bishop(x, y, color); break;
        case "wq": case "bq": pieceObj = new Queen(x, y, color); break;
        case "wk": case "bk": pieceObj = new King(x, y, color); break;
        default: pieceObj = new Piece(x, y, color);
    }    
    let allMoves = {
        
    }
    pieceObj.findMoves();
    // to fix target
    pieceObj.moves.forEach(([x, y]) => {
        console.log(boardStatus);
        
        // boardStatus[x][y].targeted = color;
    });
    boardStatus[x][y] = {name : name, id : id, color : color, moves : pieceObj.moves };
    piece.style.gridColumnStart = x + 1;
    piece.style.gridRowStart = y + 1;

    });}

    function boardLocate(){
    boardBound = chessBoard.getBoundingClientRect();
    }
    function clickLocate(event){
    clickedSquare = {
        x: Math.floor((event.clientX - boardBound.left) / boardBound.width * 8),
        y: Math.floor((event.clientY - boardBound.top) / boardBound.height * 8)
    };
    }

    class Piece {
        pos = {x:null, y:null}; color; moves = []; 
        constructor(i, j, col){
            this.pos.x = i;
            this.pos.y = j;
            this.color = col;
        }
        findMoves() {}
        movePiece(){
            setBoardStat();
        }
    }

    class Pawn extends Piece {
        findMoves(){
            let step, start = false;
            if(this.color === "b"){
                step = 1;
                if(this.pos.y == 1){
                    start = true;
                }
            }
            else{
                if(this.pos.y == 6){
                    start = true;
                }
                step = -1;
            }
            this.moves = [];
            if(boardStatus[this.pos.x][this.pos.y+step] == null){
                this.moves.push([this.pos.x, this.pos.y + step]);
                if(start && boardStatus[this.pos.x][this.pos.y+ 2*step] == null){
                    this.moves.push([this.pos.x, this.pos.y + 2*step]); 
                }
            }
            if (
                this.pos.x + 1 < 8 &&
                this.pos.y + step >= 0 &&
                this.pos.y + step < 8 &&
                boardStatus[this.pos.x + 1][this.pos.y + step] != null &&
                boardStatus[this.pos.x + 1][this.pos.y + step].color !== this.color
            ) {
                this.moves.push([this.pos.x + 1, this.pos.y + step]);
            }

            if (
                this.pos.x - 1 >= 0 &&
                this.pos.y + step >= 0 &&
                this.pos.y + step < 8 &&
                boardStatus[this.pos.x - 1][this.pos.y + step] != null &&
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
                if (boardStatus[i][this.pos.y] != null) {
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
                if (boardStatus[i][this.pos.y] != null) {
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
                if (boardStatus[this.pos.x][j] != null) {
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
                if (boardStatus[this.pos.x][j] != null) {
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
        findMoves(){
            const moves = [
                [2, 1], [1, 2],
                [-1, 2], [-2, 1],
                [-2, -1], [-1, -2],
                [1, -2], [2, -1]
            ];
            moves.forEach(([dx, dy]) => {
                let i = this.pos.x + dx; let j = this.pos.y + dy;
                if(i < 8 && j < 8 && i >= 0 && j >= 0){
                    if(boardStatus[i][j] == null){
                        this.moves.push([i, j]);
                    }else if(boardStatus[i][j].color != this.color){
                        this.moves.push([i, j]);
                    }
                }
            });
        }
    }

    class Bishop extends Piece {
        findMoves(){
            this.moves = [];
            let i = this.pos.x + 1 ; let j = this.pos.y + 1;
            while((i < 8) && (j < 8)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i++, j++;
            }
            i = this.pos.x - 1 ; j = this.pos.y + 1;
            while((i >= 0) && (j < 8)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i--, j++;
            }
            i = this.pos.x + 1 ; j = this.pos.y - 1;
            while((i < 8) && (j >= 0)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i++, j--;
            }
            i = this.pos.x - 1 ; j = this.pos.y - 1;
            while((i >= 0) && (j >= 0)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i--, j--;
            }
        }
    }   

    class Queen extends Piece {
        findMoves(){
            this.moves = [];
    
            //  Move down (x increases)
            for (let i = this.pos.x + 1; i < 8; i++) {
                if (boardStatus[i][this.pos.y] != null) {
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
                if (boardStatus[i][this.pos.y] != null) {
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
                if (boardStatus[this.pos.x][j] != null) {
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
                if (boardStatus[this.pos.x][j] != null) {
                    if (boardStatus[this.pos.x][j].color !== this.color) {
                        this.moves.push([this.pos.x, j]);
                    }
                    break;
                } else {
                    this.moves.push([this.pos.x, j]);
                }
            }
            let i = this.pos.x + 1 ; let j = this.pos.y + 1;
            while((i < 8) && (j < 8)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i++, j++;
            }
            i = this.pos.x - 1 ; j = this.pos.y + 1;
            while((i >= 0) && (j < 8)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i--, j++;
            }
            i = this.pos.x + 1 ; j = this.pos.y - 1;
            while((i < 8) && (j >= 0)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i++, j--;
            }
            i = this.pos.x - 1 ; j = this.pos.y - 1;
            while((i >= 0) && (j >= 0)){
                if(boardStatus[i][j] == null){
                    this.moves.push([i, j]);
                }else if(boardStatus[i][j].color != this.color){
                    this.moves.push([i, j]);
                }else{
                    break;
                }
                i--, j--;
            }
        }
    }

    class King extends Piece {}

    let activePiece =  new Piece();
    let activeSquare = null;
    function statusCheck(){
        activeSquare = boardStatus[clickedSquare.x][clickedSquare.y];
        if(activeSquare != null){
            switch (activeSquare.name){
                case "wp": case "bp": activePiece = new Pawn(); break;
                case "wr": case "br": activePiece = new Rook(); break;
                case "wn": case "bn": activePiece = new Knight(); break;
                case "wb": case "bb": activePiece = new Bishop(); break;
                case "wq": case "bq": activePiece = new Queen(); break;
                case "wk": case "bk": activePiece = new King(); break;
                default: activePiece = new Piece();
            } 
            showMoves();
        }   
    }
    function showMoves(){
            activePiece.color = activeSquare.color;
            activePiece.pos = { x: clickedSquare.x, y: clickedSquare.y };
            activePiece.id = activeSquare.id;
            activePiece.class = activeSquare.name;
            activePiece.findMoves();
            console.log("Possible Moves:", JSON.stringify(activePiece.moves));
    }

    chessBoard.addEventListener("click", (event) =>{
        setBoardStat();
        clickLocate(event);
        console.log(clickedSquare.x, clickedSquare.y);
        statusCheck();
    })