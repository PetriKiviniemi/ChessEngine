package com.chessengine.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/chess")
public class ChessWebSocketController {
    private final ChessModel chessModel;

    @Autowired
    public ChessWebSocketController(ChessModel chessModel) {
        this.chessModel = chessModel;
    }

    @PostMapping("/calculate-best-move")
    public ResponseEntity<String> handleChessMode(@RequestBody Map<String, String> body) throws JsonProcessingException {
        try {
            String FENstring = body.get("FENstring");
            ChessBoard chessBoard = new ChessBoard(FENstring);
            float[] predictions = chessModel.predict(chessBoard);
            System.out.print("Predictions were made: " + predictions.toString());
            String bestMove = decodeBestMove(predictions);
            return ResponseEntity.ok(objectMapper.writeValueAsString(Map.of("best_move", bestMove)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to calculate the best move!");
        }
    }
}