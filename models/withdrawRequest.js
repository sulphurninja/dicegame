import mongoose from 'mongoose'

const withdrawSchema = new mongoose.Schema({
    requestedAmount: {
        type: Number,
    },
    userName: {
        type: String,
    },
    unapproved: {
        type: Boolean,
        default: false,
    },
    approved:{
        type:Boolean,
        default: false,
    },

})

let Dataset = mongoose.models.withdraw || mongoose.model('withdraw', withdrawSchema)
export default Dataset
