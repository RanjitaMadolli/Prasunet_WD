import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [text, setText] = useState('');
    const [sentimentResult, setSentimentResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const analyzeSentiment = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/analyze_sentiment', { text });
            const data = response.data;
            setSentimentResult(data);
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            setError('Failed to analyze sentiment. Please try again.');
        }
        setLoading(false);
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
            <button onClick={analyzeSentiment} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
