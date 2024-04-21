import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
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
    },
    referralCode: {
        type: String,
        unique: true
    },
    referralWinnings: {
        type: Number,
        default: 0
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    winHistory: [{
        from: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    kycApproved: {
        type: Boolean,
        default: false,
    },
    kycSubmitted: {
        type: Boolean,
        default: false,
    },
})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset
