import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [text, setText] = useState('');
    const [sentimentResult, setSentimentResult] = useState(null);

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const analyzeSentiment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/analyze_sentiment', { text });
            const data = response.data;
            setSentimentResult(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <h1>Sentiment Analysis App</h1>
            <textarea
                placeholder="Enter text for sentiment analysis..."
                value={text}
                onChange={handleInputChange}
            ></textarea>
            <br />
            <button onClick={analyzeSentiment}>Analyze Sentiment</button>
            {sentimentResult && (
                <div>
                    <h2>Result:</h2>
                    <p>Sentiment: {sentimentResult.sentiment}</p>
                    <p>Score: {sentimentResult.score}</p>
                </div>
            )}
        </div>
    );
}

export default App;
