import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json('User created successfully!');
        
    } catch (error) {
        if (error.code === 11000) {
            next(errorHandler(403, 'Username or Email is already exists'))
        } else {
            next(error);
        }
    }
}