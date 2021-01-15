import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import User from './UserModel.js'

const validateUserId = async (uid) => 
{
    try
    {
        // const user = await User.exists({id:uid})
        User.countDocuments({_id: uid}, function (err, count){ 
            if(count>0){
                return true
            }
            else
            {
                return false
            }
        }); 
    }
    catch(e)
    {
        console.log(e)
        return false
    }
}
const postSchema = mongoose.Schema(
    {

        uid:
        {
            type:String,
            required:[true,"No User associated with the post"],
            validate:[validateUserId,"User Id not valid"]
        },
        title:
        {
            type:String,
            required:[true,"Please Give Your Post a Title"],
        },
        description:
        {
            type:String,
        },
        date:
        {
            type:Date,
        },
        images:
        {
            type:Array,
        },
        likeCount:
        {
            type:Number,
            default:0
        },
        likedUsers:
        {
            type:[String],
            default:[]
        },
        comments:
        {
            type:[String],
            default:[]
        },
        tags:[String]
    }
);


const Post = mongoose.model('post',postSchema)

export default Post