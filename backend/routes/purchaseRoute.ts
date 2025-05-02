import express, { Router } from "express";
import { completePurchase, getPurchaseHistory } from "../controllers/purchaseController";

const purchaseRouter: Router = express.Router();

// Complete purchase (move items from cart to purchase history)
purchaseRouter.post("/purchase/:userID", completePurchase);

// Get user's purchase history
purchaseRouter.get("/purchase/:userID", getPurchaseHistory);

export default purchaseRouter;
