import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    balance:{
        type:Number,
        default: 0,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    name: {
        type: String,
        required: true
    },
    root: {
        type: Boolean,
        default: false
    }
})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset