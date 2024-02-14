import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
    id: Number,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Administration" },
    status: String,
    orderName: String,
    productName: {
        title: String,
        sum: Number,
        comment: String
    },
    branding: {
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
    salePrice: Number,
    counts: Number,
    markUp: Number,
    priceForOne: Number,
    salesAmountWithMarkup: Number,
    costPrice: Number,
    margin: Number
}, { timestamps: true });

export default mongoose.model('Orders',OrdersSchema)