import express, { Request, Response, NextFunction } from "express";
import { createLogger } from "./middleware/logger";
import cors from "cors";
import userRouter from "./routes/userRoute";
import connectDB from "./config/db";
import { rateLimit } from "./middleware/rateLimit";
import githubRouter from "./routes/githubRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";
import purchaseRouter from "./routes/purchaseRoute";

const app = express();
const logger = createLogger('server');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Test route
app.get("/api/testing", (_req: Request, res: Response) => {
    res.json({ message: "API is running" });
});

// Root route for Vercel health check
app.get("/", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.use(express.json());
app.use(limiter as any);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
});
app.use("/api/v1/", githubRouter);
app.use("/api/v1/", userRouter);
app.use("/api/v1/", productRouter);
app.use("/api/v1/", cartRouter);
app.use("/api/v1/", purchaseRouter);

// Connect to database when in development mode
if (process.env.NODE_ENV !== 'production') {
    const main = async () => {
        await connectDB();
        const PORT = process.env.PORT || 5555;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    };
    main();
} else {
    // In production (Vercel), connect to DB but don't start server
    connectDB().catch(err => console.error('Failed to connect to database:', err));
}

// Export the Express app for Vercel
export default app;

