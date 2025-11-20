page 50201 "Chess Game V2"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = None;
    Caption = 'Chess Game V2';

    layout
    {
        area(content)
        {
            usercontrol(ChessBoard; "ChessBoardControlV2")
            {
                ApplicationArea = All;
                trigger OnPieceMoved(FromRow: Integer; FromCol: Integer; ToRow: Integer; ToCol: Integer)
                begin
                    // Handle move in AL
                end;

                trigger OnBoardReset()
                begin
                    // Handle board reset in AL
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
                Caption = 'Reset Board';
                Image = Refresh;
                trigger OnAction()
                begin
                    CurrPage.ChessBoard.ResetBoard();
                end;
            }
        }
    }
}
