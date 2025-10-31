import jwt from 'jsonwebtoken';
import User from '../model/user.model.js'; // (if using mongo db storage)

const producter = async (req, res, next) => {
    try {
        console.log('=== Debug Cookie Information ===');
        console.log('All cookies:', req.cookies);
        console.log('Cookie header:', req.headers.cookie);
        console.log('Origin:', req.headers.origin);
        console.log('Authorization header:', req.headers.authorization);
        console.log('========================');

        const token = req.cookies.sign;
        if(!token) {
            console.log('Cookie debug: Available cookies:', Object.keys(req.cookies));
            console.log('Request headers:', JSON.stringify(req.headers, null, 2));
            return res.status(400).json({error: "No token found"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decode) {
            return res.status(400).json({error: "wrong token"})
        }

        const user = await User.findById(decode.userId);

        if(!user) {
            return res.status(400).json({error: "User not found"})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in producter", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export default producter;