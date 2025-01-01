package com;

import java.util.List;

public class ChessMoveData {
    private String bestMove;
    private List<String> legalMoves;

    public ChessMoveData(String bMove, List<String> lMoves)
    {
        setLegalMoves(lMoves);
        setBestMove(bMove);
    }

    public void setBestMove(String bMove)
    {
        this.bestMove = bMove;
    }

    public void setLegalMoves(List<String> lMoves)
    {
        this.legalMoves = lMoves;
    }

    public String getBestMove()
    {
        return this.bestMove;
    }

    public List<String> getLegalMoves()
    {
        return this.legalMoves;
    }
}
