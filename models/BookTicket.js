import mongoose from "mongoose";


const BookTicket = new mongoose.Schema({
    trainID: {
        type: String,
        required: true,
    },
    trainCode: {
        type: String,
        required: true,
    },
    bookingCode: {
        type: String,
        required: true,
    },
    Total: {
        type: Number,
        required: false,
    },
    TotalBH: {
        type: Number,
        required: true,
    },
    codeBH: {
        type: String,
        required: true,
    },
    tickets: [
        {
            Id: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            unitPrice: {
                type: Number,
                required: true,
            }
        }
    ]

})


export default mongoose.model('BookTicket', BookTicket)

