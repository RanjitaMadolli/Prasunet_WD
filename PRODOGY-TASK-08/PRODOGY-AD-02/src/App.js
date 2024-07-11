
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => socket.off('receiveMessage');
    }, []);

    const sendMessage = () => {
        socket.emit('sendMessage', message);
        setMessage('');
    };

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
}

export default App;
