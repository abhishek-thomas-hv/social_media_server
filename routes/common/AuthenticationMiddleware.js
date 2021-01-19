import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { statusCodes } from '../../lib/statusCodes.js'

dotenv.config();

export const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.jwt_authentication_token;

    if (token) {

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(statusCodes.UNAUTHORISED).json({ "Token_Error": "Invalid Token" })
            }

            else {
                res.locals.user = decodedToken.id
                next()
            }
        })
    }

    else {

        res.status(statusCodes.UNAUTHORISED).json({ "Token_Error": "No Token Found" })

    }
}