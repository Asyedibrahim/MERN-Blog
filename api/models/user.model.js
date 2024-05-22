import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required:true,
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.44546679.1716336000&semt=ais_user"
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;