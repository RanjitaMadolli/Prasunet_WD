import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Editor from '../../components/Editor';

const Post = () => {
    const [post, setPost] = useState(null);
    const [content, setContent] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchPost = async () => {
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
                const res = await axios.get(`/api/posts/${id}`, config);
                setPost(res.data);
                setContent(res.data.content);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: token,
                },
            };
            await axios.put(`/api/posts/${id}`, { title: post.title, content }, config);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Post</h1>
            <input
                type="text"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <Editor content={content} setContent={setContent} />
            <button onClick={handleUpdate}>Update Post</button>
        </div>
    );
};

export default Post;
