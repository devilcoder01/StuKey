import express, { Router } from "express";
import { getAllProducts, getProductById } from "../controllers/productController";

const productRouter: Router = express.Router();

// Get all products
productRouter.get("/products", getAllProducts as express.RequestHandler);

// Get a single product by ID
productRouter.get("/products/:id", getProductById as express.RequestHandler);

export default productRouter;
