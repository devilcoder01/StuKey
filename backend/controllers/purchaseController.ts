import { Request, Response } from 'express';
import Cart from '../model/cart';
import Product from '../model/products';
import PurchaseHistory from '../model/purchaseHistory';
import { createLogger } from '../middleware/logger';

const logger = createLogger('purchaseController');

// Complete purchase (move items from cart to purchase history)
export const completePurchase = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;

        // Find all cart items for the user
        const cartItems = await Cart.find({ userID });

        if (cartItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No items found in cart'
            });
        }

        // Create purchase history records for each cart item
        const purchaseRecords = await Promise.all(
            cartItems.map(async (item) => {
                // Get product details to store the current price
                const product = await Product.findOne({ id: item.productID });
                
                if (!product) {
                    throw new Error(`Product with ID ${item.productID} not found`);
                }

                // Create purchase record
                return PurchaseHistory.create({
                    userID: item.userID,
                    productID: item.productID,
                    quantity: item.quantity,
                    price: product.price,
                    purchasedAt: new Date()
                });
            })
        );

        // Clear the user's cart after successful purchase
        await Cart.deleteMany({ userID });

        res.status(200).json({
            success: true,
            message: 'Purchase completed successfully',
            data: purchaseRecords
        });
    } catch (error) {
        logger.error('Error completing purchase', { error, userID: req.params.userID });
        res.status(500).json({
            success: false,
            message: 'Error completing purchase',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get user's purchase history
export const getPurchaseHistory = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;

        // Find all purchase records for the user
        const purchaseRecords = await PurchaseHistory.find({ userID }).sort({ purchasedAt: -1 });

        // Get product details for each purchase record
        const purchaseWithProducts = await Promise.all(
            purchaseRecords.map(async (record) => {
                const product = await Product.findOne({ id: record.productID });
                return {
                    _id: record._id,
                    userID: record.userID,
                    productID: record.productID,
                    quantity: record.quantity,
                    price: record.price,
                    purchasedAt: record.purchasedAt,
                    product: product || { message: 'Product not found' }
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Purchase history fetched successfully',
            count: purchaseRecords.length,
            data: purchaseWithProducts
        });
    } catch (error) {
        logger.error('Error fetching purchase history', { error, userID: req.params.userID });
        res.status(500).json({
            success: false,
            message: 'Error fetching purchase history',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
