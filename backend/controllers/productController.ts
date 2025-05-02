import { Request, Response } from 'express';
import Product from '../model/products';
import { createLogger } from '../middleware/logger';

const logger = createLogger('productController');

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        
        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No products found",
                data: []
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            count: products.length,
            data: products
        });
    } catch (error) {
        logger.error('Error fetching products', { error });
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ id: productId });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        logger.error('Error fetching product', { error, productId: req.params.id });
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
