import mongoose from "mongoose";

const ClientsSchema = new mongoose.Schema({
    fullname: String,
    company: String,
    email: String,
    phone: String,
}, { timestamps: true });

export default mongoose.model('Clients',ClientsSchema)