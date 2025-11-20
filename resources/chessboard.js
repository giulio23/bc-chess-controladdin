// Enhanced interactive chessboard with AL integration and basic AI
const pieceUnicode = {
    wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
    bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

let boardState = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

let selected = null;
let currentTurn = 'w'; // 'w' for white, 'b' for black
let aiEnabled = false;
let aiColor = 'b'; // AI plays black by default

function renderBoard() {
    let container = document.getElementById('chessboard-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chessboard-container';
        document.body.appendChild(container);
    }
    
    let html = '<table class="chessboard-table">';
    for (let row = 0; row < 8; row++) {
        html += '<tr>';
        for (let col = 0; col < 8; col++) {
            let piece = boardState[row][col];
            let isSelected = selected && selected.row === row && selected.col === col;
            let validMove = selected && isValidMove(selected.row, selected.col, row, col);
            
            html += `<td class="chess-square${isSelected ? ' selected' : ''}${validMove ? ' valid-move' : ''}" 
                         data-row="${row}" data-col="${col}" 
                         onclick="window.squareClick(${row},${col})">`;
            if (piece) {
                html += `<span>${pieceUnicode[piece]}</span>`;
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    
    // Add turn indicator
    html += `<div style="text-align: center; margin-top: 10px; font-size: 18px; font-weight: bold;">
                Current Turn: ${currentTurn === 'w' ? 'White' : 'Black'}
             </div>`;
    
    container.innerHTML = html;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Can't move to same square
    if (fromRow === toRow && fromCol === toCol) return false;
    
    let piece = boardState[fromRow][fromCol];
    if (!piece) return false;
    
    // Check if it's the correct player's turn
    if (piece[0] !== currentTurn) return false;
    
    // Can't capture own piece
    let targetPiece = boardState[toRow][toCol];
    if (targetPiece && targetPiece[0] === piece[0]) return false;
    
    // Basic movement rules (simplified)
    let rowDiff = Math.abs(toRow - fromRow);
    let colDiff = Math.abs(toCol - fromCol);
    let pieceType = piece[1];
    
    switch (pieceType) {
        case 'P': // Pawn
            if (piece[0] === 'w') {
                // White pawn moves up (decreasing row)
                if (toRow >= fromRow) return false;
                if (fromCol === toCol && !targetPiece) {
                    // Move forward
                    if (fromRow - toRow === 1) return true;
                    if (fromRow === 6 && fromRow - toRow === 2 && !boardState[fromRow - 1][fromCol]) return true;
                }
                // Capture diagonally
                if (Math.abs(fromCol - toCol) === 1 && fromRow - toRow === 1 && targetPiece) return true;
            } else {
                // Black pawn moves down (increasing row)
                if (toRow <= fromRow) return false;
                if (fromCol === toCol && !targetPiece) {
                    // Move forward
                    if (toRow - fromRow === 1) return true;
                    if (fromRow === 1 && toRow - fromRow === 2 && !boardState[fromRow + 1][fromCol]) return true;
                }
                // Capture diagonally
                if (Math.abs(fromCol - toCol) === 1 && toRow - fromRow === 1 && targetPiece) return true;
            }
            return false;
            
        case 'R': // Rook
            if (fromRow !== toRow && fromCol !== toCol) return false;
            return isPathClear(fromRow, fromCol, toRow, toCol);
            
        case 'N': // Knight
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            
        case 'B': // Bishop
            if (rowDiff !== colDiff) return false;
            return isPathClear(fromRow, fromCol, toRow, toCol);
            
        case 'Q': // Queen
            if (fromRow !== toRow && fromCol !== toCol && rowDiff !== colDiff) return false;
            return isPathClear(fromRow, fromCol, toRow, toCol);
            
        case 'K': // King
            return rowDiff <= 1 && colDiff <= 1;
            
        default:
            return false;
    }
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    let rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
    let colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (boardState[currentRow][currentCol]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

window.squareClick = function (row, col) {
    if (aiEnabled && currentTurn === aiColor) {
        // Don't allow clicks during AI turn
        return;
    }
    
    if (selected) {
        // Try to move piece
        if (isValidMove(selected.row, selected.col, row, col)) {
            let piece = boardState[selected.row][selected.col];
            let capturedPiece = boardState[row][col];
            
            boardState[row][col] = piece;
            boardState[selected.row][selected.col] = '';
            
            // Toggle turn
            currentTurn = currentTurn === 'w' ? 'b' : 'w';
            
            // Notify AL
            if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
                Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnPieceMoved', [
                    selected.row + 1, 
                    selected.col + 1, 
                    row + 1, 
                    col + 1,
                    capturedPiece || ''
                ]);
            }
            
            selected = null;
            renderBoard();
            
            // AI move after a short delay
            if (aiEnabled && currentTurn === aiColor) {
                setTimeout(makeAIMove, 500);
            }
            
            return;
        }
    }
    
    // Select piece
    if (boardState[row][col] && boardState[row][col][0] === currentTurn) {
        selected = { row, col };
    } else {
        selected = null;
    }
    renderBoard();
}

function makeAIMove() {
    // Simple AI: find all valid moves and pick a random one
    let validMoves = [];
    
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            let piece = boardState[fromRow][fromCol];
            if (piece && piece[0] === aiColor) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                            let captureValue = 0;
                            let targetPiece = boardState[toRow][toCol];
                            if (targetPiece) {
                                // Prioritize captures
                                let pieceValues = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
                                captureValue = pieceValues[targetPiece[1]] || 0;
                            }
                            validMoves.push({ 
                                fromRow, fromCol, toRow, toCol, 
                                priority: captureValue 
                            });
                        }
                    }
                }
            }
        }
    }
    
    if (validMoves.length > 0) {
        // Sort by priority (captures first)
        validMoves.sort((a, b) => b.priority - a.priority);
        
        // Pick from top 5 moves (adds some randomness)
        let topMoves = validMoves.slice(0, Math.min(5, validMoves.length));
        let move = topMoves[Math.floor(Math.random() * topMoves.length)];
        
        let piece = boardState[move.fromRow][move.fromCol];
        let capturedPiece = boardState[move.toRow][move.toCol];
        
        boardState[move.toRow][move.toCol] = piece;
        boardState[move.fromRow][move.fromCol] = '';
        
        // Toggle turn
        currentTurn = currentTurn === 'w' ? 'b' : 'w';
        
        // Notify AL
        if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
            Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnPieceMoved', [
                move.fromRow + 1, 
                move.fromCol + 1, 
                move.toRow + 1, 
                move.toCol + 1,
                capturedPiece || ''
            ]);
        }
        
        renderBoard();
    }
}

window.MovePiece = function (fromRow, fromCol, toRow, toCol) {
    if (isValidMove(fromRow - 1, fromCol - 1, toRow - 1, toCol - 1)) {
        boardState[toRow - 1][toCol - 1] = boardState[fromRow - 1][fromCol - 1];
        boardState[fromRow - 1][fromCol - 1] = '';
        currentTurn = currentTurn === 'w' ? 'b' : 'w';
        renderBoard();
    }
};

window.ResetBoard = function () {
    boardState = [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ];
    currentTurn = 'w';
    selected = null;
    
    if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnBoardReset', []);
    }
    
    renderBoard();
};

window.SetBoardState = function (state) {
    boardState = JSON.parse(state);
    selected = null;
    renderBoard();
};

window.EnableAI = function (enable, color) {
    aiEnabled = enable;
    aiColor = color || 'b';
    
    // If it's AI's turn, make a move
    if (aiEnabled && currentTurn === aiColor) {
        setTimeout(makeAIMove, 500);
    }
};

window.addEventListener('DOMContentLoaded', function () {
    renderBoard();
});
