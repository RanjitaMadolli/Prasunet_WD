import connectDB from '../../../lib/db';
import Post from '../../../models/Post';
import auth from '../../../middleware/auth';

connectDB();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const post = await Post.findById(id).populate('author', 'username');
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { title, content } = req.body;
            let post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (post.author.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            let post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (post.author.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            await post.remove();
            res.status(200).json({ message: 'Post removed' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
