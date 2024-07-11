import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            history.push
