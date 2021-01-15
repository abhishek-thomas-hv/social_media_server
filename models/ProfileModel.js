import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const profileSchema = mongoose.Schema(
    {

        uid:
        {
            type:String
        },
        firstName:
        {
            type:String,
        },
        lastName:
        {
            type:String,
        },
        mobileNumber:{
            type:String,
        },
        gender:{
            type:String
        },
        dateOfBirth:
        {
            type:Date
        },
        profilePicture:
        {
            type:String
        },
        friends:
        {
            type:[String],
            default:[]
        },
        friendRequests:
        {
            type:[String],
            default:[]
        },
        address:String,
        education:String,
        work:String,
        hobbies:[String]
    }
);


const Profile = mongoose.model('profile',profileSchema)

export default Profile