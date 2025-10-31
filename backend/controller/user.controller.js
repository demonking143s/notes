import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username}).select('-password'); 

        if(!user) {
            return res.status(400).json({error: "user not found"})
        }

        return res.status(201).json(user);
    } catch (error) {
        console.log("Error in getProfile page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 

        if(!user) {
            return res.status(400).json({error: "user not found"})
        }

        const {username, email, oldPassword, newPassword} = req.body;

        if(!username && !email && !oldPassword && !newPassword) {
            return res.status(200).json({message: "no changes happened"});
        }

        
        if ((!oldPassword && newPassword) || (oldPassword && !newPassword)) {
            return res.status(400).json({error: "both password required"});
        }

        if(oldPassword && newPassword) {
            if (oldPassword.length < 8 || newPassword.length < 8) {
                return res.status(400).json({error: "Password length must be 8 charecters or more"});
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if(!isMatch) {
                return res.status(400).json({error: "Password not match"});
            }
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
        }

        if(username && (username !== user.username)) {
            const existingUsername = await User.findOne({username}) 

            if (existingUsername && existingUsername.length > 0 && username !== user.username) {
                return res.status(400).json({error: "Username already exists"})
            }
            user.username = username
        }

        if(email && (email !== user.email)) {
            const emailRegux = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegux.test(email)) {
                return res.status(400).json({error: "Invalid email"});
            }

            const existingemail = await User.findOne({email}); 

            if (existingemail && existingemail > 1 && email != user.email) {
                return res.status(400).json({error: "Email already exists"})
            }
            user.email = email
        }
        
        await user.save(); 
        
        return res.status(200).json({message: "Profile updated successfully"});
    } catch (error) {
        console.log("Error in updateUser page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}