import mongoose from "mongoose";

const CalculationsSchema = new mongoose.Schema({
    
}, { timestamps: true });

export default mongoose.model('Calculations',CalculationsSchema)