import connectDB from '../../../lib/db';
import Post from '../../../models/Post';
import auth from '../../../middleware/auth';

connectDB();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username');
            res.status(200).json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { title, content, userId } = req.body;
            const newPost = new Post({ title, content, author: userId });
            const post = await newPost.save();
            res.status(201).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
