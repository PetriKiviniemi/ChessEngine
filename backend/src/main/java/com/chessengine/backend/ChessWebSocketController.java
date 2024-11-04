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
    private final ObjectMapper objectMapper;
    private static final Map<Character, Integer> chessPieceToPlaneIndex = new HashMap<>();

    static {
        chessPieceToPlaneIndex.put('P', 0);
        chessPieceToPlaneIndex.put('N', 1);
        chessPieceToPlaneIndex.put('B', 2);
        chessPieceToPlaneIndex.put('R', 3);
        chessPieceToPlaneIndex.put('Q', 4);
        chessPieceToPlaneIndex.put('K', 5);
        chessPieceToPlaneIndex.put('p', 6);
        chessPieceToPlaneIndex.put('n', 7);
        chessPieceToPlaneIndex.put('b', 8);
        chessPieceToPlaneIndex.put('r', 9);
        chessPieceToPlaneIndex.put('q', 10);
        chessPieceToPlaneIndex.put('k', 11);
    }

    @Autowired
    public ChessWebSocketController(ChessModel chessModel, ObjectMapper objectMapper) {
        this.chessModel = chessModel;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/calculate-best-move")
    public ResponseEntity<String> handleChessMode(@RequestBody Map<String, String> body) throws JsonProcessingException {
        try {
            String FENstring = body.get("FENstring");
            float[][][][] boardState = convertFenToBoardState(FENstring);
            System.out.print("FEN was converted to boardState: " + boardState.toString());
            float[] predictions = chessModel.predict(boardState);
            System.out.print("Predictions were made: " + predictions.toString());
            String bestMove = decodeBestMove(predictions);
            return ResponseEntity.ok(objectMapper.writeValueAsString(Map.of("best_move", bestMove)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to calculate the best move!");
        }
    }

    private float[][][][] convertFenToBoardState(String FENstring) {
        float[][][][] boardTensor = new float[1][8][8][12];

        String boardStateStr = FENstring.split(" ")[0];
        String[] rows = boardStateStr.split("/");
        for (int row = 0; row < 8; row++) {
            int col = 0;
            for (char symbol : rows[row].toCharArray()) {
                if (Character.isDigit(symbol)) {
                    col += Character.getNumericValue(symbol);
                } else {
                    int planeIndex = chessPieceToPlaneIndex.get(symbol);
                    boardTensor[0][row][col][planeIndex] = 1.0f;
                    col++;
                }
            }
        }
        return boardTensor;
    }

    private String decodeBestMove(float[] predictions) {
        // Lets check what format the predictions are first
        for (int i = 0; i < predictions.length; i++) {
            System.out.print(predictions[i] + " ");
        }
        return "";
    }
}