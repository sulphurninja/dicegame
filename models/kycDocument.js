import mongoose from 'mongoose'

const kycSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    aadharImage: {
        type: String,
        required: true,
    },
    panImage: {
        type: String,
        required: true,
    },
    cancelledCheckImage: {
        type: String,
        required: true,
    },
    mobNo: {
        type: Number,
        required: true,
    },
    bankingName: {
        type: String,
        required: true,
    },
    AccountNo: {
        type: String,
        required: true,
    },
    IFSCCode: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    }
})

let Dataset = mongoose.models.kyc || mongoose.model('kyc', kycSchema)
export default Dataset
