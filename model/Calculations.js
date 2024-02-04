import mongoose from "mongoose";

const CalculationsSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
    orderName: {
        title: String,
        sum: Number,
        comment: String
    },
    delivery: {
        title: String,
        sum: Number,
        comment: String
    },
    design: {
        title: String,
        sum: Number,
        comment: String
    },
    aditionalRows: [
        {
            title: String,
            sum: Number,
            comment: String
        }
    ],
    counts: Number,
    markUp: Number,
    priceForOne: Number,
    salesAmountWithMarkup: Number,
    costPrice: Number,
    margin: Number
}, { timestamps: true });

export default mongoose.model('Calculations',CalculationsSchema)