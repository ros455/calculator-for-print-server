import mongoose from "mongoose";

const AdministrationSchema = new mongoose.Schema({
    login: String,
    password: String,
    isAdmin: Boolean
}, { timestamps: true });

export default mongoose.model('Administration',AdministrationSchema);