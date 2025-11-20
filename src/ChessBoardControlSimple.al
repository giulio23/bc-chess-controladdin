controladdin "ChessBoardControlSimple"
{
    Scripts = 'resources/chessboard-simple.js';
    StyleSheets = 'resources/chessboard-simple.css';
    RequestedHeight = 550;
    RequestedWidth = 550;
    VerticalStretch = false;
    HorizontalStretch = false;
    MinimumHeight = 500;
    MinimumWidth = 500;
    MaximumHeight = 600;
    MaximumWidth = 600;

    event OnPieceMoved(FromRow: Integer; FromCol: Integer; ToRow: Integer; ToCol: Integer; CapturedPiece: Text);
    event OnBoardReset();

    procedure MovePiece(FromRow: Integer; FromCol: Integer; ToRow: Integer; ToCol: Integer);
    procedure ResetBoard();
    procedure EnableAI(Enable: Boolean; AIColor: Text);
}
