import os
import random
import shutil
import chess
import numpy as np

def encode_board_state(board):
    """Converts a chess board to an 8x8x12 tensor."""
    encoded_board = np.zeros((8, 8, 12))
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            # Map piece type and color to channels
            channel = piece.piece_type - 1 + (6 if piece.color == chess.BLACK else 0)
            row, col = divmod(square, 8)
            encoded_board[row, col, channel] = 1
    return encoded_board

def encode_move(move):
    """Converts a chess move into an integer representation for training."""
    return move.from_square * 64 + move.to_square

def decode_move(encoded_move):
    """Converts the integer representation back to chess move coordinates."""
    from_square = encoded_move // 64
    to_square = encoded_move % 64
    return from_square, to_square


def split_dataset(data_dir, train_dir, val_dir, test_dir, train_pct=0.8, val_pct=0.1):
    # Create directories if they don't exist
    for directory in [train_dir, val_dir, test_dir]:
        os.makedirs(directory, exist_ok=True)
        
    # Clear existing files in the directories
    for directory in [train_dir, val_dir, test_dir]:
        for file in os.listdir(directory):
            file_path = os.path.join(directory, file)
            if os.path.isfile(file_path):
                os.unlink(file_path)
    
    # Get all X files and shuffle them
    files = [f for f in os.listdir(data_dir) if f.endswith('_X.npy')]
    random.shuffle(files)
    
    # Calculate split indices
    train_split = int(len(files) * train_pct)
    val_split = int(len(files) * (train_pct + val_pct))
    
    # Move files to respective directories
    for i, f in enumerate(files):
        source_x = os.path.join(data_dir, f)
        source_y = os.path.join(data_dir, f.replace("_X.npy", "_y.npy"))
        
        if i < train_split:
            dest_dir = train_dir
        elif i < val_split:
            dest_dir = val_dir
        else:
            dest_dir = test_dir
        
        shutil.copy(source_x, dest_dir)  # Using copy instead of move
        shutil.copy(source_y, dest_dir)  # Using copy instead of move
    
    # Print summary
    print(f"Dataset split complete:")
    print(f"  Train set: {len(os.listdir(train_dir))//2} samples")
    print(f"  Validation set: {len(os.listdir(val_dir))//2} samples")
    print(f"  Test set: {len(os.listdir(test_dir))//2} samples")