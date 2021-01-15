import express from 'express';
import {SignUp,Login,getUserId,Logout} from '../controllers/authentication.js'

const router = express.Router();

router.post('/signup',SignUp)

router.post('/login',Login)

router.get('/getuserid',getUserId)

router.get('/logout',Logout)

export default router