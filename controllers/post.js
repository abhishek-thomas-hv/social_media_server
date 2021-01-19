import Post from '../models/PostModel.js'
import Profile from '../models/ProfileModel.js'
import Comment from '../models/CommentModel.js'

const asyncGetComment = async (comments) => {
    const modifiedComments = []

    for (const comment of comments) {
        const result = await Comment.findOne({ _id: comment })
        const userProfile = await Profile.findOne({ uid: result.uid })
        modifiedComments.push(
            {
                'comment': result.text,
                'user': userProfile.firstName + " " + userProfile.lastName,
                'userProfilePicture': userProfile.profilePicture,
                'date': result.date
            }
        )
    }

    return modifiedComments.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

}

export const getPosts = async (req, res) => {


    try {

        const userId = res.locals.user
        const user = await Profile.findOne({ uid: userId }).sort({ date: -1 }).lean()
        const posts = await Post.find(
            {
                $or:
                    [
                        {
                            uid: userId
                        },
                        {
                            uid: {
                                $in: user.friends

                            }
                        }
                    ]
            }).lean()


        const asyncGetPosts = async (posts) => {



            for (const post of posts) {

                const uid = post.uid
                const userProfile = await Profile.findOne({ uid: uid })
                post.user = userProfile.firstName + " " + userProfile.lastName
                post.userProfilePicture = userProfile.profilePicture

                post.comments = await asyncGetComment(post.comments)
            }

            res.status(200).json(posts);

        }

        if (posts.length === 0) {
            res.status(200).json(posts);
        }

        else {
            asyncGetPosts(posts)
        }


    }
    catch (error) {
        res.status(400).json({ "Get_Error": error.message });
    }

}

export const addPost = async (req, res) => {
    const post = req.body;
    // console.log(req.body)
    // const userProfile = await Profile.findOne({uid:post.uid})
    // post.userName = userProfile.firstName + " " + userProfile.lastName
    // post.userProfilePicture = userProfile.profilePicture
    const uid = res.locals.user
    post.uid = uid
    const createPost = new Post(post)
    try {
        await createPost.save();
        const newPost = await Post.findById(createPost._id).lean()

        const userProfile = await Profile.findOne({ uid: newPost.uid })
        newPost.user = userProfile.firstName + " " + userProfile.lastName
        newPost.userProfilePicture = userProfile.profilePicture

        newPost.comments = await asyncGetComment(newPost.comments)
        res.status(201).json(newPost);
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ "Creation_Error": error });
    }
}


export const addCommentForPost = async (req, res) => {
    const { postId, text, date } = req.body
    const uid = res.locals.user
    const newComment = new Comment({ uid, text, date })
    try {
        await newComment.save();
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: newComment._id
            }
        }, { new: true }).lean()


        const userProfile = await Profile.findOne({ uid: updatedPost.uid })
        updatedPost.user = userProfile.firstName + " " + userProfile.lastName
        updatedPost.userProfilePicture = userProfile.profilePicture

        updatedPost.comments = await asyncGetComment(updatedPost.comments)

        res.status(201).json(updatedPost);
    }
    catch (error) {

        console.log(error)
        res.status(400).json({ "Updation_Error": error });
    }

}

export const editPost = async (req, res) => {
    const { _id } = req.body
    const post = req.body
    try {
        const updatedPost = await Post.findByIdAndUpdate(_id, { ...post, _id }, { new: true }).lean()

        const userProfile = await Profile.findOne({ uid: updatedPost.uid })
        updatedPost.user = userProfile.firstName + " " + userProfile.lastName
        updatedPost.userProfilePicture = userProfile.profilePicture

        updatedPost.comments = await asyncGetComment(updatedPost.comments)

        res.status(201).json(updatedPost);
    }
    catch (error) {

        console.log("YOWERREOR", error)
        res.status(400).json({ "Updation_Error": error });
    }

}


export const deletePost = async (req, res) => {
    const { _id } = req.params;
    console.log(_id)

    try {

        await Post.findByIdAndRemove(_id)
        res.status(200).json({ message: "Post Deleted Successfully" })
    }
    catch (error) {

        console.log(error)
        res.status(400).json({ "Updation_Error": error });
    }

}



export const addLikeForPost = async (req, res) => {
    const { _id } = req.body
    const uid = res.locals.user
    try {
        const post = await Post.findById(_id)
        const updatedPost = await Post.findByIdAndUpdate(_id, {
            likeCount: post.likeCount + 1, $push: {
                likedUsers: uid
            }
        }, { new: true }).lean()

        const userProfile = await Profile.findOne({ uid: updatedPost.uid })
        updatedPost.user = userProfile.firstName + " " + userProfile.lastName
        updatedPost.userProfilePicture = userProfile.profilePicture

        updatedPost.comments = await asyncGetComment(updatedPost.comments)

        res.status(201).json(updatedPost);
    }
    catch (error) {

        console.log(error)
        res.status(400).json({ "Updation_Error": error });
    }

}



export const removeLikeForPost = async (req, res) => {
    const { _id } = req.body
    const uid = res.locals.user
    try {
        const post = await Post.findById(_id)
        const updatedPost = await Post.findByIdAndUpdate(_id, {
            likeCount: post.likeCount - 1, $pull: {
                likedUsers: uid
            }
        }, { new: true }).lean()

        const userProfile = await Profile.findOne({ uid: updatedPost.uid })
        updatedPost.user = userProfile.firstName + " " + userProfile.lastName
        updatedPost.userProfilePicture = userProfile.profilePicture

        updatedPost.comments = await asyncGetComment(updatedPost.comments)

        res.status(201).json(updatedPost);
    }
    catch (error) {

        console.log(error)
        res.status(400).json({ "Updation_Error": error });
    }

}
