import express, { Router } from "express";
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} from "../controllers/cartController";

const cartRouter: Router = express.Router();

// Add product to cart
cartRouter.post("/cart", addToCart);

// Get user's cart
cartRouter.get("/cart/:userID", getCart);

// Update cart item quantity
cartRouter.put("/cart", updateCartItem);

// Remove item from cart
cartRouter.delete("/cart/item", removeFromCart);

// Clear cart
cartRouter.delete("/cart/:userID", clearCart);

export default cartRouter;
