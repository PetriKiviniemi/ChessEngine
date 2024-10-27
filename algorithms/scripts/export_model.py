import os
import tensorflow as tf

model_path = os.path.join(os.path.dirname(__file__), '..', 'models')
model_name = 'chess_cnn_model.keras'
model_path_in_backend = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src', 'main', 'resources', 'models')

# Load your .keras model
model = tf.keras.models.load_model(os.path.join(model_path, model_name))
print(model.summary())

# Save as SavedModel format
# This creates a directory containing your model
model.export(model_path)
model.export(model_path_in_backend)

# Optional: To verify the export
loaded = tf.saved_model.load(model_path)
print("Model loaded successfully")

# Print the model signatures
signatures = loaded.signatures
for signature_key in signatures.keys():
    print(f"Signature Key: {signature_key}")
    signature = signatures[signature_key]
    
    # Print input and output names and their shapes
    print("Inputs:")
    for input_name in signature.structured_input_signature[1].keys():
        print(f"  Input Name: {input_name}, Shape: {signature.structured_input_signature[1][input_name]}")

    print("Outputs:")
    for output_name in signature.structured_outputs.keys():
        print(f"  Output Name: {output_name}, Shape: {signature.structured_outputs[output_name]}")
