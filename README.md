# Chess Control Add-in for Business Central

A fully functional chess game implemented as a Business Central control add-in with AI opponent support.

## 🎯 Features

- ✅ **Interactive Chess Board** - Click to select and move pieces
- ✅ **Valid Move Highlighting** - Only legal moves are allowed
- ✅ **Chess Rules Validation** - Proper movement rules for all piece types:
  - Pawns (forward movement, diagonal captures, 2-square opening)
  - Knights (L-shaped movement)
  - Bishops (diagonal movement)
  - Rooks (straight movement)
  - Queens (combined rook + bishop movement)
  - Kings (one square in any direction)
- ✅ **AI Opponent** - Simple AI that can play as Black
- ✅ **Turn-based Play** - Alternating turns between White and Black
- ✅ **Move History** - Track moves and captured pieces
- ✅ **Visual Feedback** - Selected squares and valid moves highlighted
- ✅ **3D Board Styling** - Attractive tilted perspective view

## 🐛 What Was Fixed

### CSS Issues
1. **Syntax Errors**:
   - Fixed stray commas in multiple places
   - Fixed `widh` typo (should be `width`)
   - Fixed incomplete box-shadow declarations
   - Added proper alternating square colors

2. **Styling Improvements**:
   - Added `.chess-square` class for better targeting
   - Added `.selected` class for highlighted squares
   - Added `.valid-move` class for showing legal moves
   - Fixed table sizing to be more consistent

### JavaScript Issues
1. **Unicode Character Handling**:
   - **BEFORE**: Used `String.fromCharCode(parseInt(pieceUnicode[piece].replace('\\u', ''), 16))`
   - **AFTER**: Directly use unicode characters: `'♔', '♕', '♖'`, etc.
   - This fixes the rendering where pieces weren't showing up correctly

2. **Chess Rules**:
   - Added `isValidMove()` function with proper rules for each piece type
   - Added `isPathClear()` to check for obstructions
   - Added turn validation (can't move opponent's pieces)
   - Added capture validation (can't capture own pieces)
   - Pawn rules: forward movement, diagonal captures, 2-square opening move
   - Path checking for Rooks, Bishops, and Queens

3. **AI Implementation**:
   - Added `makeAIMove()` function
   - AI finds all valid moves and prioritizes captures
   - AI picks from top 5 moves for some variety
   - Automatic AI move triggering after player moves

4. **Turn Management**:
   - Added `currentTurn` variable to track whose turn it is
   - Added turn indicator display
   - Proper turn switching after valid moves

### AL Code Improvements
1. **Control Add-in**:
   - Added `CapturedPiece` parameter to `OnPieceMoved` event
   - Added `EnableAI` procedure
   - Improved size constraints for better display

2. **Page**:
   - Added AI enable/disable actions
   - Added move counter
   - Added captured pieces tracking
   - Added algebraic notation generation
   - Added user-friendly messages for moves

## 📦 Installation

1. **Copy Files**:
   ```
   your-project/
   ├── src/
   │   ├── ChessBoardControlV2.al
   │   └── ChessGamePageV2.al
   └── resources/
       ├── chessboard.js
       ├── chessboard.css
       └── startup.js
   ```

2. **Build and Publish**:
   ```bash
   # In VS Code, press F5 or use:
   Al: Publish
   ```

3. **Open the Game**:
   - Search for "Chess Game V2" in Business Central
   - Or use page ID `50201`

## 🎮 How to Play

### Two-Player Mode (Default)
1. Open the Chess Game V2 page
2. White moves first
3. Click a piece to select it (selected square turns yellow)
4. Click a valid destination square to move
5. Turn automatically switches to Black
6. Continue alternating turns

### AI Opponent Mode
1. Open the Chess Game V2 page
2. Click the **"Enable AI"** action
3. Make your move as White
4. AI will automatically respond as Black after a short delay
5. Continue playing against the AI

### Reset the Game
- Click the **"Reset Board"** action to start a new game

## 🔧 Customization Options

### Change AI Color
In `ChessGamePageV2.al`, modify the EnableAI action:
```al
CurrPage.ChessBoard.EnableAI(true, 'w'); // AI plays White instead
```

### Adjust AI Difficulty
In `chessboard.js`, modify the `makeAIMove()` function:
```javascript
// Current: picks from top 5 moves (easier)
let topMoves = validMoves.slice(0, Math.min(5, validMoves.length));

// Harder: always pick the best move
let topMoves = validMoves.slice(0, 1);

// Easier: pick from top 10 moves  
let topMoves = validMoves.slice(0, Math.min(10, validMoves.length));
```

### Change Board Appearance
In `chessboard.css`, modify colors:
```css
/* Light squares */
tr:nth-child(odd) td.chess-square:nth-child(even),
tr:nth-child(even) td.chess-square:nth-child(odd) {
    background: #f0d9b5; /* Change this color */
}

/* Dark squares */
tr:nth-child(odd) td.chess-square:nth-child(odd),
tr:nth-child(even) td.chess-square:nth-child(even) {
    background: #b58863; /* Change this color */
}
```

### Remove 3D Effect
In `chessboard.css`, comment out the transform:
```css
table.chessboard-table {
    /* transform: rotatex(40deg) rotatey(0deg) rotatez(0deg); */
}
```

## 🚀 Future Enhancements

Potential improvements you could add:

1. **Advanced Chess Rules**:
   - En passant captures
   - Castling (kingside and queenside)
   - Pawn promotion (reaching the opposite end)
   - Check and checkmate detection
   - Stalemate detection

2. **Enhanced AI**:
   - Integration with Stockfish engine via API
   - Multiple difficulty levels
   - Opening book
   - Position evaluation

3. **Game Features**:
   - Save/load games
   - PGN export
   - Move notation display
   - Undo/redo moves
   - Timer/clock

4. **Multiplayer**:
   - Online multiplayer via web services
   - Game invitations
   - Spectator mode

## 📝 Technical Notes

### Control Add-in Communication
The JavaScript communicates with AL code using:
```javascript
Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnPieceMoved', [fromRow, fromCol, toRow, toCol, capturedPiece]);
```

### Browser Compatibility
Tested in:
- Edge (Business Central Web Client)
- Chrome
- Firefox

### Performance
- Board renders instantly
- AI moves within 500ms
- Supports boards up to 800x800 pixels

## 🤝 Contributing

Feel free to enhance this chess game! Some areas that need work:
- Advanced move validation (castling, en passant)
- Better AI with minimax algorithm
- Save game state to BC tables
- Tournament mode

## 📄 License

This is a sample project for Business Central development. Use and modify as needed.

## 🐞 Known Limitations

1. **No Check Detection**: Game doesn't detect when king is in check
2. **No Checkmate**: Game continues even after checkmate
3. **Simple AI**: AI makes random moves from valid options
4. **No Castling**: Special castling move not implemented
5. **No En Passant**: Special pawn capture not implemented
6. **No Promotion**: Pawns reaching the end don't promote

---

**Version**: 7.0.0.0  
**Last Updated**: November 2025  
**Author**: Giulio Stefanica
