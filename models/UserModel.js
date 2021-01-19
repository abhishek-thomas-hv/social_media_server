import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
    {
        email:
        {
            type: String,
            required: [true, "Please Enter an Email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please Enter a Valid Email"]
        },
        password: {
            type: String,
            required: [true, "Please Enter an Password"],
            minlength: [6, "Minimum Password Length - 6 Characters"]
        },
    }
);


userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }

        throw Error('Incorrent Password')
    }

    throw Error('Incorrect Email');
}

const User = mongoose.model('user', userSchema)

export default User