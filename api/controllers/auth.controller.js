import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password || !email || username === '' || email === '' || password === '') {
            return next(errorHandler(400, 'All fields are required'));
        };
        
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
};


export const signin = async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password || username === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'))
    }
    try {
        const validUser = await User.findOne({username});
        if (!validUser) 
            return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword)
            return next(errorHandler(404, 'Invalid password!'));

        const token = jwt.sign({id: validUser._id, isAdmin: validUser.isAdmin}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);

    } catch (error) {
        next(error)
    }
};


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
    
        if (user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        } else {
    
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
    
            const newUser = new User({
                username: req.body.username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4) , 
                email: req.body.email, 
                password: hashedPassword,
                avatar: req.body.avatar
            });
            
            await newUser.save();

            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
        
    } catch (error) {
        next(error)
    }
};


export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User sign out successfully!')
    } catch (error) {
        next(error)
    }
};