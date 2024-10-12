from models.cnn_chess_model import create_model
import os
import glob
from .utils import data_generator

base_data_dir = 'data/processed'
train_data_dir = f'{base_data_dir}/train'
val_data_dir = f'{base_data_dir}/val'
test_data_dir = f'{base_data_dir}/test'

# Model parameters
batch_size = 32
steps_per_epoch = max(1, len(glob.glob(os.path.join(train_data_dir, "*_X.npy"))) // batch_size)
validation_steps = max(1, len(glob.glob(os.path.join(val_data_dir, "*_X.npy"))) // batch_size)


# Model configuration
input_shape = (8,8,12) # Chessboard
num_classes = 4672

# Create a new model
model = create_model(input_shape, num_classes)

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

train_gen = data_generator(train_data_dir, batch_size)
val_gen = data_generator(val_data_dir, batch_size)

# Train the model
history = model.fit(
    train_gen,
    steps_per_epoch=steps_per_epoch,
    validation_data=val_gen,
    validation_steps=validation_steps,
    epochs=10, # NOTE:: Adjust
    verbose=1,
)

# Save the model
model.save(os.path.join(os.path.dirname(__file__), '..', 'models', 'chess_cnn_model.keras'))
