from flask import Flask, request, jsonify, render_template
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './static/uploads'
app.config['MODEL_PATH'] = './models/mobilenet_model.h5'

# Load the pre-trained model
model = None  # Placeholder for the loaded model

def load_model():
    global model
    model = # Load your pre-trained model here (e.g., tf.keras.models.load_model)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Load and preprocess the image for model prediction
            img = image.load_img(filepath, target_size=(224, 224))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)

            # Make prediction
            preds = model.predict(x)
            predictions = decode_predictions(preds, top=3)[0]  # Top 3 predictions

            results = [{'label': label, 'probability': float(prob)} for (label, _, prob) in predictions]

            return jsonify(results)

        return jsonify({'error': 'Invalid file format'})

if __name__ == '__main__':
    load_model()
    app.run(debug=True)
