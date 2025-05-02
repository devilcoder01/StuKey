import mongoose, { Document, Schema } from "mongoose";

interface Product extends Document {
    id : number;
    name : string;
    description : string;
    price : number;
    category : string;
    image : string;
}

const productSchema = new Schema({
    id : {
        type: Number,
        required: true,
        unique: true,
    },
    name : {
        type: String,
        required: true,
        unique: true,
    },
    description : {
        type: String,
        required: true,
    },  
    price : {
        type: Number,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
    image : {
        type: String,
        required: true,
    },
}, {
    timestamps: false // Add timestamps for better tracking
});

export default mongoose.model<Product>('products', productSchema);
