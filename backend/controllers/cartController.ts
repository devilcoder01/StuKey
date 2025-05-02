import { Request, Response } from 'express';
import Cart from '../model/cart';
import Product from '../model/products';
import { createLogger } from '../middleware/logger';

const logger = createLogger('cartController');

// Add product to cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { userID, productID, quantity } = req.body;

        // Validate required fields
        if (!userID || !productID) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Check if product exists
        const product = await Product.findOne({ id: productID });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if item already exists in cart
        const existingCartItem = await Cart.findOne({ userID, productID });

        if (existingCartItem) {
            // Update quantity if item already exists
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();

            return res.status(200).json({
                success: true,
                message: 'Cart updated successfully',
                data: existingCartItem
            });
        }

        // Create new cart item
        const cartItem = await Cart.create({
            userID,
            productID,
            quantity: quantity || 1
        });

        res.status(201).json({
            success: true,
            message: 'Product added to cart',
            data: cartItem
        });
    } catch (error) {
        logger.error('Error adding to cart', { error });
        res.status(500).json({
            success: false,
            message: 'Error adding to cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;

        // Find all cart items for the user
        const cartItems = await Cart.find({ userID });

        // Get product details for each cart item
        const cartWithProducts = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findOne({ id: item.productID });
                return {
                    _id: item._id,
                    userID: item.userID,
                    productID: item.productID,
                    quantity: item.quantity,
                    createdAt: item.createdAt,
                    product: product || { message: 'Product not found' }
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            count: cartItems.length,
            data: cartWithProducts
        });
    } catch (error) {
        logger.error('Error fetching cart', { error, userID: req.params.userID });
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { userID, productID, quantity } = req.body;

        // Validate required fields
        if (!userID || !productID || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'User ID, Product ID, and quantity are required'
            });
        }

        // Find the cart item
        const cartItem = await Cart.findOne({ userID, productID });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
            await Cart.deleteOne({ userID, productID });
            return res.status(200).json({
                success: true,
                message: 'Item removed from cart'
            });
        }

        // Update quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: cartItem
        });
    } catch (error) {
        logger.error('Error updating cart', { error });
        res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { userID, productID } = req.body;

        // Validate required fields
        if (!userID || !productID) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Delete the cart item
        const result = await Cart.deleteOne({ userID, productID });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        logger.error('Error removing from cart', { error });
        res.status(500).json({
            success: false,
            message: 'Error removing from cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;

        // Delete all cart items for the user
        const result = await Cart.deleteMany({ userID });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No items found in cart'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            itemsRemoved: result.deletedCount
        });
    } catch (error) {
        logger.error('Error clearing cart', { error, userID: req.params.userID });
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
