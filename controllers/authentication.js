import User from '../models/UserModel.js'
import Profile from '../models/ProfileModel.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'



const handleErrors = (errors) =>
{

    let errorMessage = {
        email:'',
        password:''
    }

    if(errors.code===11000)
    {
        errorMessage['email']="An account with that email already exists"
        return errorMessage
    }

    if(errors.message.includes('user validation failed'))
    {

        // return errors.errors
        Object.values(errors.errors).forEach( ({properties}) => {
            errorMessage[properties.path]=properties.message
        });
    }

    return errorMessage
}


const maxAge = 60*60*24*3
const secret = 'myjsonwebtokensecret'

const createToken = (id) =>
{
    return jwt.sign({id},secret,{expiresIn:maxAge})
}

export const SignUp = async (req,res) =>
{

    const {email,password} = req.body
    const {firstName,lastName,mobileNumber,profilePicture,gender,dateOfBirth} = req.body
    console.log(req.body)
    try{

        const user = await User.create({email,password})
        const token = createToken(user._id)
        const uid = user._id
        const profile = await Profile.create({uid,firstName,lastName,mobileNumber,profilePicture,gender,dateOfBirth})
        res.cookie('jwt_authentication_token',token,{httpOnly:true,maxAge:maxAge*1000,sameSite:"lax"})
        res.status(201).json({"user":user._id})
 
     }
     catch(error)
     {
         console.log(error)
         const errors = handleErrors(error)
         res.status(400).json({"errors":errors})
     }

}



export const Login = async (req,res) => 
{
    const {email,password} = req.body
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt_authentication_token',token,{httpOnly:true,maxAge:maxAge*1000,sameSite:"lax"})
        res.status(200).json({"user":user._id})
    }
    catch(error)
    {
        console.log(error)
        res.status(400).send({"error":"Please check the email/Password you have entered"})
    }
}


export const Logout = async (req,res) => 
{
    res.cookie('jwt_authentication_token','',{httpOnly:true,maxAge:1,sameSite:"lax"})
    res.status(200).send(true)
}


export const getUserId = async (req,res) => 
{
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
                res.status(200).json({"user_id":decodedToken})
            }
        })
    }

    else
    {

        res.status(400).json({"Token_Error":"No Token Found"})

    }
}