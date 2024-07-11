from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the pre-trained sentiment analysis model (VADER)
sentiment_classifier = pipeline('sentiment-analysis')

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    if request.method == 'POST':
        data = request.get_json()

        if 'text' not in data:
            return jsonify({'error': 'No text provided'})

        text = data['text']

        # Perform sentiment analysis
        results = sentiment_classifier(text)

        # Format the result
        sentiment = results[0]['label']
        score = results[0]['score']

        return jsonify({'sentiment': sentiment, 'score': score})

if __name__ == '__main__':
    app.run(debug=True)
