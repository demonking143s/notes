import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: '15d'});
    const cookieOptions = {
        maxAge: 15*24*60*60*1000, // 15 days in milliseconds
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
res.cookie('sign', token, cookieOptions);
}

export default generateToken;