import mongoose from 'mongoose'

const commentSchema = mongoose.Schema(
    {

        uid:
        {
            type: String
        },
        text:
        {
            type: String,
        },
        date:
        {
            type: Date,
        },
    }
);


const Comment = mongoose.model('comment', commentSchema)

export default Comment