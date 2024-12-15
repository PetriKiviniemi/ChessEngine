import os
import numpy as np
import chess
import glob
from .preprocess_data import encode_board_state, decode_move

def data_generator(data_dir, batch_size):
    files = glob.glob(os.path.join(data_dir, "*_X.npy"))
    print(f"Found {len(files)} files in {data_dir}")
    while True:
        np.random.shuffle(files)  # Shuffle files for each epoch
        X_batch, y_batch = [], []
        for file in files:
            try:
                X = np.load(file, allow_pickle=False)
                y = np.load(file.replace("_X.npy", "_y.npy"), allow_pickle=False)
                
                # Check if the file contains multiple board states
                if len(X.shape) == 4:  # (num_states, 8, 8, 12)
                    for i in range(X.shape[0]):
                        X_batch.append(X[i])
                        y_batch.append(y[i])
                elif X.shape == (8, 8, 12):  # Single board state
                    X_batch.append(X)
                    y_batch.append(y)
                else:
                    print(f"Unexpected shape in file {file}: {X.shape}")
                    continue
                
                # Yield batch when it reaches the desired size
                while len(X_batch) >= batch_size:
                    X_yield = np.array(X_batch[:batch_size])
                    y_yield = np.array(y_batch[:batch_size])
                    X_batch = X_batch[batch_size:]
                    y_batch = y_batch[batch_size:]
                    yield X_yield, y_yield
                    
            except Exception as e:
                print(f"Error loading file {file}: {str(e)}")
        
        # Yield any remaining data
        if X_batch and y_batch:
            yield np.array(X_batch), np.array(y_batch)

def predict_best_move(model, board_state):
    print(model.to_json())

    encoded_board_state = encode_board_state(board_state)
    print(encoded_board_state)

    # Expand into 2d matrix
    input_board = np.expand_dims(encoded_board_state, axis=0)
    print("Input tensor: ", input_board)

    move_probabilities = model.predict(input_board)[0]
    print("Python first few predictions:", move_probabilities[:10])
    top_5_predictions = np.argsort(move_probabilities)[-5:][::-1]

    legal_moves = []
    for prediction in top_5_predictions:
        from_square, to_square = decode_move(prediction)
        move = chess.Move(from_square, to_square)
        print("Prediction: ", prediction, from_square, to_square, move)
        if move in board_state.legal_moves:
            legal_moves.append((move, move_probabilities[prediction]))
    
    return legal_moves[0][0] if legal_moves else None