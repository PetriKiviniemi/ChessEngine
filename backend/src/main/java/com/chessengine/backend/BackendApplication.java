package com.chessengine.backend;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);

		ChessBoard chessBoard = new ChessBoard("rn1qkbnr/pppbpppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -");
		chessBoard.printBoard();

		List<String> legal_moves = new ArrayList<String>();
		int[][] dirs = {
				{ -1, -1 }, // up-left
				{ -1, 1 }, // up-right
				{ 1, -1 }, // down-left
				{ 1, 1 } // down-right
		};
		chessBoard.addSlidingMoves(1, 3, dirs, legal_moves);
		for (String str : legal_moves) {
			System.out.println("Move: " + str);
		}
		System.out.println("Done");
	}

}
