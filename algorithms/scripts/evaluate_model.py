import numpy as np
import chess
import os
import glob
import tensorflow as tf
from .utils import data_generator, predict_best_move

test_data_dir = 'data/processed/test'

# Params
batch_size = 32

model = tf.keras.models.load_model("models/chess_cnn_model.h5")

test_gen = data_generator(test_data_dir, batch_size)
test_steps = len(glob.glob(os.path.join(test_data_dir, "*_X.npy"))) // batch_size

# Evaluate the model
test_loss, test_accuracy = model.evaluate(test_gen, steps=test_steps)

# Generate chessboard and check what move the model will give as best move
board_state = chess.Board()
board_state.push_san("e4") # White to move, push E4 pawn

best_move = predict_best_move(model, board_state)
if best_move:
    print(f"Predicted best move: {best_move}")
else:
    print("No legal moves generated")

print(f"Test Loss: {test_loss}, Test Accuracy: {test_accuracy}")