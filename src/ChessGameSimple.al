page 50202 "Chess Game Simple"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = Tasks;
    Caption = 'Chess Game';

    layout
    {
        area(content)
        {
            group(GameControls)
            {
                Caption = 'Game Controls';
                
                field(MoveCount; MoveCount)
                {
                    Caption = 'Moves';
                    ApplicationArea = All;
                    Editable = false;
                }
            }

            usercontrol(ChessBoard; "ChessBoardControlSimple")
            {
                ApplicationArea = All;

                trigger OnPieceMoved(FromRow: Integer; FromCol: Integer; ToRow: Integer; ToCol: Integer; CapturedPiece: Text)
                begin
                    MoveCount += 1;
                    
                    if CapturedPiece <> '' then
                        Message('Move %1: Captured %2!', MoveCount, CapturedPiece);
                end;

                trigger OnBoardReset()
                begin
                    MoveCount := 0;
                    Message('Board reset to starting position');
                end;
            }
        }
    }

    actions
    {
        area(processing)
        {
            action(ResetBoard)
            {
                Caption = 'New Game';
                Image = Refresh;
                ToolTip = 'Reset the board to starting position';
                
                trigger OnAction()
                begin
                    CurrPage.ChessBoard.ResetBoard();
                end;
            }
            
            action(PlayVsAI)
            {
                Caption = 'Play vs AI';
                Image = Start;
                ToolTip = 'Enable AI opponent (plays as Black)';
                
                trigger OnAction()
                begin
                    CurrPage.ChessBoard.EnableAI(true, 'black');
                    Message('AI enabled! You play White, AI plays Black.');
                end;
            }
            
            action(TwoPlayer)
            {
                Caption = 'Two Player';
                Image = Users;
                ToolTip = 'Disable AI for two-player mode';
                
                trigger OnAction()
                begin
                    CurrPage.ChessBoard.EnableAI(false, '');
                    Message('Two-player mode enabled.');
                end;
            }
        }
    }

    var
        MoveCount: Integer;
}
