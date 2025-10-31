// mongodb model
import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        values: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;