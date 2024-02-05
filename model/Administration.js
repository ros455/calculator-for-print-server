import mongoose from "mongoose";

const AdministrationSchema = new mongoose.Schema({
    login: String,
    password: String,
    isAdmin: Boolean,
    color: String
}, { timestamps: true });

export default mongoose.model('Administration',AdministrationSchema);