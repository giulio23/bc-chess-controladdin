// Simplified chessboard with position-based system and CSS classes
var currentTurn = 'white'; // 'white' or 'black'
var selected = null;
var aiEnabled = false;
var aiColor = 'black';

// Piece type mapping: position -> {color, type}
var boardState = {};

// Initial piece positions (1-64, left to right, top to bottom)
var initialPieces = [
    { position: 1, color: 'black', type: 'rook' },
    { position: 2, color: 'black', type: 'knight' },
    { position: 3, color: 'black', type: 'bishop' },
    { position: 4, color: 'black', type: 'queen' },
    { position: 5, color: 'black', type: 'king' },
    { position: 6, color: 'black', type: 'bishop' },
    { position: 7, color: 'black', type: 'knight' },
    { position: 8, color: 'black', type: 'rook' },
    { position: 9, color: 'black', type: 'pawn' },
    { position: 10, color: 'black', type: 'pawn' },
    { position: 11, color: 'black', type: 'pawn' },
    { position: 12, color: 'black', type: 'pawn' },
    { position: 13, color: 'black', type: 'pawn' },
    { position: 14, color: 'black', type: 'pawn' },
    { position: 15, color: 'black', type: 'pawn' },
    { position: 16, color: 'black', type: 'pawn' },
    { position: 49, color: 'white', type: 'pawn' },
    { position: 50, color: 'white', type: 'pawn' },
    { position: 51, color: 'white', type: 'pawn' },
    { position: 52, color: 'white', type: 'pawn' },
    { position: 53, color: 'white', type: 'pawn' },
    { position: 54, color: 'white', type: 'pawn' },
    { position: 55, color: 'white', type: 'pawn' },
    { position: 56, color: 'white', type: 'pawn' },
    { position: 57, color: 'white', type: 'rook' },
    { position: 58, color: 'white', type: 'knight' },
    { position: 59, color: 'white', type: 'bishop' },
    { position: 60, color: 'white', type: 'queen' },
    { position: 61, color: 'white', type: 'king' },
    { position: 62, color: 'white', type: 'bishop' },
    { position: 63, color: 'white', type: 'knight' },
    { position: 64, color: 'white', type: 'rook' }
];

// Helper: Convert position (1-64) to row/col (0-7)
function posToRowCol(pos) {
    return {
        row: Math.floor((pos - 1) / 8),
        col: (pos - 1) % 8
    };
}

// Helper: Convert row/col to position
function rowColToPos(row, col) {
    return row * 8 + col + 1;
}

// Initialize the board
function initBoard() {
    var chessboard = document.getElementById('chessboard');
    if (!chessboard) {
        chessboard = document.createElement('table');
        chessboard.id = 'chessboard';
        document.body.appendChild(chessboard);
    }
    
    chessboard.innerHTML = '';
    var position = 1;
    
    for (var row = 0; row < 8; row++) {
        var rowEl = document.createElement('tr');
        for (var col = 0; col < 8; col++) {
            var cellEl = document.createElement('td');
            cellEl.dataset.position = position;
            cellEl.onclick = function() { handleSquareClick(this); };
            rowEl.appendChild(cellEl);
            position++;
        }
        chessboard.appendChild(rowEl);
    }
    
    // Add turn indicator
    var turnDiv = document.getElementById('turn-indicator');
    if (!turnDiv) {
        turnDiv = document.createElement('div');
        turnDiv.id = 'turn-indicator';
        document.body.appendChild(turnDiv);
    }
    
    resetBoard();
}

function setPieceData(el, color, type) {
    el.className = ''; // Clear classes
    if (color && type) {
        el.classList.add(color);
        el.classList.add(type);
    }
}

function resetBoard() {
    boardState = {};
    
    // Clear all squares
    var allCells = document.querySelectorAll('#chessboard td');
    allCells.forEach(function(cell) {
        setPieceData(cell, null, null);
    });
    
    // Place pieces
    initialPieces.forEach(function(piece) {
        var pieceEl = document.querySelector('td[data-position="' + piece.position + '"]');
        setPieceData(pieceEl, piece.color, piece.type);
        boardState[piece.position] = { color: piece.color, type: piece.type };
    });
    
    currentTurn = 'white';
    selected = null;
    updateDisplay();
    
    // Notify AL
    if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnBoardReset', []);
    }
}

function updateDisplay() {
    // Update turn indicator
    var turnDiv = document.getElementById('turn-indicator');
    if (turnDiv) {
        turnDiv.textContent = 'Current Turn: ' + currentTurn.toUpperCase();
    }
    
    // Clear selection highlighting
    var allCells = document.querySelectorAll('#chessboard td');
    allCells.forEach(function(cell) {
        cell.classList.remove('selected');
        cell.classList.remove('valid-move');
    });
    
    // Highlight selected square
    if (selected) {
        var selectedEl = document.querySelector('td[data-position="' + selected + '"]');
        if (selectedEl) {
            selectedEl.classList.add('selected');
            
            // Highlight valid moves
            for (var pos = 1; pos <= 64; pos++) {
                if (isValidMove(selected, pos)) {
                    var targetEl = document.querySelector('td[data-position="' + pos + '"]');
                    if (targetEl) {
                        targetEl.classList.add('valid-move');
                    }
                }
            }
        }
    }
}

function handleSquareClick(cellEl) {
    var position = parseInt(cellEl.dataset.position);
    
    // Don't allow clicks during AI turn
    if (aiEnabled && currentTurn === aiColor) {
        return;
    }
    
    if (selected) {
        // Try to move
        if (isValidMove(selected, position)) {
            movePiece(selected, position);
            selected = null;
            
            // AI move after delay
            if (aiEnabled && currentTurn === aiColor) {
                setTimeout(makeAIMove, 500);
            }
        } else {
            // Try to select new piece
            var piece = boardState[position];
            if (piece && piece.color === currentTurn) {
                selected = position;
            } else {
                selected = null;
            }
        }
    } else {
        // Select piece
        var piece = boardState[position];
        if (piece && piece.color === currentTurn) {
            selected = position;
        }
    }
    
    updateDisplay();
}

function movePiece(fromPos, toPos) {
    var piece = boardState[fromPos];
    var capturedPiece = boardState[toPos];
    
    // Update DOM
    var fromEl = document.querySelector('td[data-position="' + fromPos + '"]');
    var toEl = document.querySelector('td[data-position="' + toPos + '"]');
    
    setPieceData(fromEl, null, null);
    setPieceData(toEl, piece.color, piece.type);
    
    // Update state
    boardState[toPos] = piece;
    delete boardState[fromPos];
    
    // Toggle turn
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    
    // Notify AL
    if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
        var fromRC = posToRowCol(fromPos);
        var toRC = posToRowCol(toPos);
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnPieceMoved', [
            fromRC.row + 1, fromRC.col + 1,
            toRC.row + 1, toRC.col + 1,
            capturedPiece ? capturedPiece.color[0] + capturedPiece.type[0].toUpperCase() : ''
        ]);
    }
    
    updateDisplay();
}

function isValidMove(fromPos, toPos) {
    if (fromPos === toPos) return false;
    
    var piece = boardState[fromPos];
    if (!piece) return false;
    if (piece.color !== currentTurn) return false;
    
    var target = boardState[toPos];
    if (target && target.color === piece.color) return false;
    
    var from = posToRowCol(fromPos);
    var to = posToRowCol(toPos);
    var rowDiff = Math.abs(to.row - from.row);
    var colDiff = Math.abs(to.col - from.col);
    
    switch (piece.type) {
        case 'pawn':
            if (piece.color === 'white') {
                // White pawns move up (decreasing row)
                if (to.row >= from.row) return false;
                if (from.col === to.col && !target) {
                    if (from.row - to.row === 1) return true;
                    if (from.row === 6 && from.row - to.row === 2 && !boardState[rowColToPos(from.row - 1, from.col)]) return true;
                }
                if (Math.abs(from.col - to.col) === 1 && from.row - to.row === 1 && target) return true;
            } else {
                // Black pawns move down (increasing row)
                if (to.row <= from.row) return false;
                if (from.col === to.col && !target) {
                    if (to.row - from.row === 1) return true;
                    if (from.row === 1 && to.row - from.row === 2 && !boardState[rowColToPos(from.row + 1, from.col)]) return true;
                }
                if (Math.abs(from.col - to.col) === 1 && to.row - from.row === 1 && target) return true;
            }
            return false;
            
        case 'rook':
            if (from.row !== to.row && from.col !== to.col) return false;
            return isPathClear(fromPos, toPos);
            
        case 'knight':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            
        case 'bishop':
            if (rowDiff !== colDiff) return false;
            return isPathClear(fromPos, toPos);
            
        case 'queen':
            if (from.row !== to.row && from.col !== to.col && rowDiff !== colDiff) return false;
            return isPathClear(fromPos, toPos);
            
        case 'king':
            return rowDiff <= 1 && colDiff <= 1;
    }
    
    return false;
}

function isPathClear(fromPos, toPos) {
    var from = posToRowCol(fromPos);
    var to = posToRowCol(toPos);
    
    var rowStep = to.row > from.row ? 1 : (to.row < from.row ? -1 : 0);
    var colStep = to.col > from.col ? 1 : (to.col < from.col ? -1 : 0);
    
    var currentRow = from.row + rowStep;
    var currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
        if (boardState[rowColToPos(currentRow, currentCol)]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

function makeAIMove() {
    var validMoves = [];
    
    // Find all valid moves for AI
    for (var fromPos = 1; fromPos <= 64; fromPos++) {
        var piece = boardState[fromPos];
        if (piece && piece.color === aiColor) {
            for (var toPos = 1; toPos <= 64; toPos++) {
                if (isValidMove(fromPos, toPos)) {
                    var priority = 0;
                    var target = boardState[toPos];
                    if (target) {
                        var values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
                        priority = values[target.type] || 0;
                    }
                    validMoves.push({ from: fromPos, to: toPos, priority: priority });
                }
            }
        }
    }
    
    if (validMoves.length > 0) {
        validMoves.sort(function(a, b) { return b.priority - a.priority; });
        var topMoves = validMoves.slice(0, Math.min(5, validMoves.length));
        var move = topMoves[Math.floor(Math.random() * topMoves.length)];
        
        movePiece(move.from, move.to);
    }
}

// AL integration functions
window.ResetBoard = resetBoard;

window.EnableAI = function(enable, color) {
    aiEnabled = enable;
    aiColor = color || 'black';
    if (aiEnabled && currentTurn === aiColor) {
        setTimeout(makeAIMove, 500);
    }
};

window.MovePiece = function(fromRow, fromCol, toRow, toCol) {
    var fromPos = rowColToPos(fromRow - 1, fromCol - 1);
    var toPos = rowColToPos(toRow - 1, toCol - 1);
    if (isValidMove(fromPos, toPos)) {
        movePiece(fromPos, toPos);
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBoard);
} else {
    initBoard();
}
