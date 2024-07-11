import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const config = {
                    headers: {
                        Authorization: token,
                    },
                };
                const res = await axios.get('/api/posts', config);
                setPosts(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                {posts.map((post) => (
                    <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.content.slice(0, 100)}...</p>
                        <a href={`/posts/${post._id}`}>Read More</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
