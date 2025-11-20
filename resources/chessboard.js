// Minimal interactive chessboard with AL integration
const pieceUnicode = {
    wK: '\u2654', wQ: '\u2655', wR: '\u2656', wB: '\u2657', wN: '\u2658', wP: '\u2659',
    bK: '\u265A', bQ: '\u265B', bR: '\u265C', bB: '\u265D', bN: '\u265E', bP: '\u265F'
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
            html += `<td class="chess-square${isSelected ? ' selected' : ''}" data-row="${row}" data-col="${col}" onclick="window.squareClick(${row},${col})">`;
            if (piece) {
                html += `<span>${String.fromCharCode(parseInt(pieceUnicode[piece].replace('\\u', ''), 16))}</span>`;
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
}

window.squareClick = function (row, col) {
    if (selected) {
        // Move piece
        let piece = boardState[selected.row][selected.col];
        if (piece && (selected.row !== row || selected.col !== col)) {
            boardState[row][col] = piece;
            boardState[selected.row][selected.col] = '';
            // Notify AL
            if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
                Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnPieceMoved', [selected.row + 1, selected.col + 1, row + 1, col + 1]);
            }
        }
        selected = null;
        renderBoard();
        return;
    }
    if (boardState[row][col]) {
        selected = { row, col };
    } else {
        selected = null;
    }
    renderBoard();
}

window.MovePiece = function (fromRow, fromCol, toRow, toCol) {
    boardState[toRow - 1][toCol - 1] = boardState[fromRow - 1][fromCol - 1];
    boardState[fromRow - 1][fromCol - 1] = '';
    renderBoard();
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
    if (window.Microsoft && Microsoft.Dynamics && Microsoft.Dynamics.NAV && Microsoft.Dynamics.NAV.InvokeExtensibilityMethod) {
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnBoardReset', []);
    }
    selected = null;
    renderBoard();
};

window.SetBoardState = function (state) {
    boardState = JSON.parse(state);
    selected = null;
    renderBoard();
};

window.addEventListener('DOMContentLoaded', function () {
    renderBoard();
});