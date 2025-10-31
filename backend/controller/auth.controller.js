import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import User from '../model/user.model.js';

export const signUp = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;
        
        if (!username || !email || !password || !role) {
            return res.status(400).json({error: "All detailes required"});
        }

        const emailRegux = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegux.test(email)) {
            return res.status(400).json({error: "Invalid email"});
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password length must be 8 charecters or more"});
        }

        // (if using mongodb)
        const existingUsername = await User.findOne({username});
        const existingEmail = await User.findOne({email});

        if (existingUsername || existingEmail) {
            return res.status(400).json({error: "User already exists"})
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password : hashedPassword,
            role
        })

        if (newUser) {
            await newUser.save();

            res.cookie('sign', '', {maxAge: 0})
            generateToken(newUser._id, res);
            return res.status(201).json({message: "User created successfully"});
        }
    } catch (error) {
        console.log("Error in signup page", error);
        return res.status(500).json({error: "Internal server error"})
    }  
}

export const logIn = async (req, res) => {
    try {
        const {input, password} = req.body;
        
        if (!input || !password ) {
            return res.status(400).json({error: "All detailes required"});
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password length must be 8 charecters or more"});
        }

        const user = await User.findOne({ $or: [ { username: input }, { email: input } ] });

        const isPasswordCorrect = await bcrypt.compare(password, user.password || '');

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"})
        }

        res.cookie('sign', '', {maxAge: 0})
        generateToken(user._id, res);
        return res.status(201).json({message: "User logged in successfully"});
    } catch (error) {
        console.log("Error in login page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const logOut = async (req, res) => {
    try {
        res.cookie('sign', '', {maxAge: 0})
        return res.status(201).json({message: "logout succussfully"});
    } catch (error) {
        console.log("Error in logout page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({_id:req.user._id});
        return res.status(201).json(user);
    } catch (error) {
        console.log("Error in getMe page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}