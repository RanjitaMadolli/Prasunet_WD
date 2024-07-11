from flask import Flask, request, jsonify, render_template
import cv2
import numpy as np
from skimage import transform
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load pre-trained FaceNet model
model = load_model('models/facenet_weights.h5', compile=False)

# Function to preprocess images for FaceNet model
def preprocess_image(image):
    image = cv2.resize(image, (160, 160))
    image = image.astype('float32')
    mean, std = image.mean(), image.std()
    image = (image - mean) / std
    image = np.expand_dims(image, axis=0)
    return image

# Function to detect faces using OpenCV
def detect_faces(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    return faces

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Read image file
    image = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Detect faces in the image
    faces = detect_faces(image)

    # Process each detected face
    results = []
    for (x, y, w, h) in faces:
        face_img = image[y:y+h, x:x+w]
        
        # Preprocess face image for FaceNet model
        processed_img = preprocess_image(face_img)
        
        # Perform face recognition using FaceNet model
        embedding = model.predict(processed_img)
        
        # Prepare result
        result = {
            'bbox': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)},
            'embedding': embedding.tolist()[0]  # Convert numpy array to list for JSON serialization
        }
        results.append(result)

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
