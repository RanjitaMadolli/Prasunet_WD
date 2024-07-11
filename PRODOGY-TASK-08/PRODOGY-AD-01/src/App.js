
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/dashboard" component={Dashboard} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;

// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        try {
            const res = await axios.post('/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            history.push('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;

// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [preferences, setPreferences] = useState([]);
    const history = useHistory();

    const handleRegister = async () => {
        try {
            await axios.post('/api/users/register', { name, email, password, preferences });
            history.push('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={preferences} onChange={(e) => setPreferences(e.target.value.split(','))} placeholder="Preferences (comma separated)" />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;

// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('/api/users/profile', { headers: { 'x-auth-token': token } });
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {user.name}</h2>
            <h3>Your Preferences:</h3>
            <ul>
                {user.preferences.map((pref, index) => (
                    <li key={index}>{pref}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
