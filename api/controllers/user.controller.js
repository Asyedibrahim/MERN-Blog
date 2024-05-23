import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';


export const test = (req, res) => {
    res.json({message: 'Api is working'})
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, 'You can only update your own account!'));
    }

    if (req.body.password) {
        if(req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be atleast 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contains spaces'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contains letter and numbers'))
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId ,{
            $set: {
                username: req.body.username,
                email: req.body.email, 
                password: req.body.password,
                avatar: req.body.avatar
            },
        }, { new: true });

        const { password: pass, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        
    } catch (error) {
        if (error.code === 11000) {
            next(errorHandler(403, 'Username or Email is already exists'))
        } else {
            next(error);
        }
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) 
        return next(errorHandler(401, 'You are not allowed to delete this account!'))

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!')
        
    } catch (error) {
        next(error);
    }
}