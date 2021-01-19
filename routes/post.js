import express from 'express';
import { getPosts, addPost, addCommentForPost, addLikeForPost, editPost, deletePost, removeLikeForPost } from '../controllers/post.js'
import { AuthMiddleware } from './common/AuthenticationMiddleware.js'


const router = express.Router();

router.get('/getposts', AuthMiddleware, getPosts)

router.post('/addpost', AuthMiddleware, addPost)

router.post('/editpost', AuthMiddleware, editPost)

router.delete('/deletepost/:_id', AuthMiddleware, deletePost)

router.post('/addcomment', AuthMiddleware, addCommentForPost)

router.post('/addlike', AuthMiddleware, addLikeForPost)

router.post('/removelike', AuthMiddleware, removeLikeForPost)

export default router