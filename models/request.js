import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    requestedAmount: {
        type: Number,
    },
    userName: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false,
    },

})

let Dataset = mongoose.models.request || mongoose.model('request', requestSchema)
export default Dataset
