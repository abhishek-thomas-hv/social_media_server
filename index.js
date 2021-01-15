import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import AuthRoutes from './routes/authentication.js'
import PostRoutes from './routes/post.js'
import ProfileRoutes from './routes/profile.js'
import cookieParser from 'cookie-parser'

const app = express();

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cookieParser());

app.use(cors(
    {
      origin: 'http://localhost:3000',
      credentials: true
    }
  ));


app.use('/auth',AuthRoutes)
app.use('/post',PostRoutes)
app.use('/profile',ProfileRoutes)


// const CONNECTION_URL = 'mongodb+srv://new_user:new_user@cluster0.a2r6f.mongodb.net/Social-Media?retryWrites=true&w=majority';
const CONNECTION_URL = 'mongodb://localhost/social_media'
const PORT = process.env.PORT || 5000;


mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => {
    app.listen(PORT,() => {
        console.log("SERVER RUNNING");
    })
})
.catch((error) => {
    console.log(error)
})

mongoose.set('useFindAndModify',false)
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true)
