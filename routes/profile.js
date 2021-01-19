import express from 'express';
import { getProfile, editProfile, addFriend, getUsers, acceptRequest, declineRequest } from '../controllers/profile.js'
import { AuthMiddleware } from './common/AuthenticationMiddleware.js'

const router = express.Router();

router.get('/getprofile', AuthMiddleware, getProfile)

router.post('/editprofile', editProfile)

router.get('/getusers', AuthMiddleware, getUsers)

router.post('/addfriend', AuthMiddleware, addFriend)

router.post('/acceptrequest', AuthMiddleware, acceptRequest)

router.post('/declinerequest', AuthMiddleware, declineRequest)

export default router