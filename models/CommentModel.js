import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const commentSchema = mongoose.Schema(
    {

        uid:
        {
            type:String
        },
        text:
        {
            type:String,
        },
        date:
        {
            type:Date,
        },
    }
);


const Comment = mongoose.model('comment',commentSchema)

export default Comment