import jwt from 'jsonwebtoken'

export const AuthMiddleware = (req,res,next) =>
{

    // console.log(req.cookies)
    const token = req.cookies.jwt_authentication_token;

    if(token)
    {

        jwt.verify(token,'myjsonwebtokensecret',(err,decodedToken) => {
            if(err)
            {
                res.status(400).json({"Token_Error":"Invalid Token"})
            }

            else
            {
                res.locals.user=decodedToken.id
                next()
            }
        })
    }

    else
    {

        res.status(400).json({"Token_Error":"No Token Found"})

    }
}