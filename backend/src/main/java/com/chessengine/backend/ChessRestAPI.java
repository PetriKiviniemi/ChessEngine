package com.chessengine.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ChessMoveData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/chess")
public class ChessRestAPI {
    private final ChessModel chessModel;

    public ChessRestAPI(ChessModel chessModel) {
        this.chessModel = chessModel;
    }

    @PostMapping("/get-move-data")
    public ResponseEntity<?> handleChessMode(@RequestBody Map<String, String> body) throws JsonProcessingException {
        try {
            String FENstring = body.get("FENstring");
            ChessBoard chessBoard = new ChessBoard(FENstring);
            List<String> predictions = chessModel.predict(chessBoard);
            System.out.println(chessBoard.getLegalMoves());
            ChessMoveData data = new ChessMoveData(predictions.get(0), chessBoard.getLegalMoves());
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get chess move data!");
        }
    }
}