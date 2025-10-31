import jwt from 'jsonwebtoken';
import User from '../model/user.model.js'; // (if using mongo db storage)

const producter = async (req, res, next) => {
    try {
        const token = req.cookies.sign;
        console.log(req.cookies)
        if(!token) {
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