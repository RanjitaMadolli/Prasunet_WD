import jwt from 'jsonwebtoken';
import config from '../config';

export default async function auth(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}
