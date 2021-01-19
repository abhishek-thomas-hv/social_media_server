import jwt from 'jsonwebtoken'

export const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.jwt_authentication_token;

    if (token) {
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(400).json({ "Token_Error": "Invalid Token" })
            }

            else {
                res.locals.user = decodedToken.id
                next()
            }
        })
    }

    else {

        res.status(400).json({ "Token_Error": "No Token Found" })

    }
}