import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: '15d'});
    res.cookie('sign', token, {
        maxAge: 15*24*60*1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV !== 'development',
        path: '/'
    })
}

export default generateToken;