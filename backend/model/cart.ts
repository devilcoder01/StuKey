import mongoose, { Document, Schema } from "mongoose";

interface Cart extends Document {
    userID: string;
    productID: string;
    quantity: number;
    createdAt: Date;
}

const cartSchema = new Schema({
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
        min: 1,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Add timestamps for better tracking
});

// Compound index to ensure a user can't add the same product twice
// Instead, the quantity should be updated
cartSchema.index({ userID: 1, productID: 1 }, { unique: true });

export default mongoose.model<Cart>('cart', cartSchema);
