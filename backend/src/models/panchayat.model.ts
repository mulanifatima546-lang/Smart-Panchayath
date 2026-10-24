import mongoose from "mongoose";

const panchayatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    taluk: {
        type: String,
        required: true,
        trim: true
    },
    village: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    sarpanch: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const panchayatModel = mongoose.model("Panchayat", panchayatSchema);

export default panchayatModel;