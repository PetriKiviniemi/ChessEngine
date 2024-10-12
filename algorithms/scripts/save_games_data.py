# This is simply a script that calls parse & preprocess functions
from .preprocess_data import encode_board_state, encode_move, split_dataset
import chess.pgn
import numpy as np
import os

PGN_FILE_PATH = 'data/pgn/Alekhine.pgn'
PROCESSED_DATA_PATH = 'data/processed'

def save_game_data(board_states, moves, game_id):
    X = np.array(board_states)
    y = np.array(moves)

    np.save(os.path.join(PROCESSED_DATA_PATH, f'game_{game_id}_X.npy'), X)
    np.save(os.path.join(PROCESSED_DATA_PATH, f'game_{game_id}_y.npy'), y)

"""God script for parsing PGN file, encoding boardstates & moves to tensor representation, and saving to np arrays"""
def parse_pgn_and_encode(pgn_file):
    with open(pgn_file) as f:
        game_idx = 0
        game = chess.pgn.read_game(f)

        while game is not None:
            board = game.board()

            board_states = []
            moves = []

            # Save board state, save the move and
            # move to next position
            for move in game.mainline_moves():
                board_states.append(encode_board_state(board))
                moves.append(encode_move(move))
                board.push(move)
            
            # Save the game into numpy file that has tensor representation of board state, and the moves
            save_game_data(board_states, moves, game_idx)

            # Move to the next game
            game_idx += 1
            game = chess.pgn.read_game(f)

parse_pgn_and_encode(PGN_FILE_PATH)

# Split dataset into training, valuation and testing data
split_dataset('data/processed', 'data/processed/train', 'data/processed/val', 'data/processed/test')