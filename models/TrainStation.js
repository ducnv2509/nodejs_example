import mongoose from "mongoose";


const TrainStation = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    tenGa: {
        type: String,
        required: false,
    },
    maGa: {
        type: String,
        required: false,
    },
    sKeys: {
        type: String,
        required: false,
    },
    thoiGian: {
        type: Date,
        required: false,
    }
})


export default mongoose.model('TrainStation', TrainStation)

