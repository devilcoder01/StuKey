import mongoose, { Document, Schema } from "mongoose";

interface PurchaseHistory extends Document {
    userID: string;
    productID: string;
    quantity: number;
    purchasedAt: Date;
    price: number; // Store the price at the time of purchase
}

const purchaseHistorySchema = new Schema({
    userID: {
        type: String,
        required: true,
        ref: 'users' // Reference to the User model
    },
    productID: {
        type: String,
        required: true,
        ref: 'products' // Reference to the Product model
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    purchasedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Add timestamps for better tracking
});

export default mongoose.model<PurchaseHistory>('purchaseHistory', purchaseHistorySchema);
