import express, { NextFunction, Request, Response, Router } from "express";

import User from "../model/user";  // Fix the import path and use ES6 import
import verifyHandler from "../middleware/verify";
import { ethers } from 'ethers';
import { responseEncoding } from "axios";
import user from "../model/user";

const userRouter: Router = express.Router();


userRouter.get("/user", async (req: Request, res: Response) => {
    try {
        const walletAddress = req.query.walletAddress as string;
        const user = await User.findOne({ walletAddress });
        if(user){
            res.status(200).json({ success: true, message: "Users fetched" , user})
        }
        else{
            res.status(204).json({message: "NO user found"})
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'No user found',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
userRouter.put("/update", async(req: Request, res: Response) => {
    try {
        const walletAddress = req.body.walletAddress as string;
        const data = req.body;
        const users = await User.find({ walletAddress });
        if (users.length > 0) {
            Object.assign(users[0], data); // Only update fields present in data
            await users[0].save();
        }
        res.status(200).json({ success: true, message: "Users fetched" , users})
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})
// userRouter.post("/updateusername" , async (req: Request, res: Response) => {
//     try{
//         const username = req.body.username as string;
//         const walletAddress = req.body.walletAddress as string;
//         const user = await User.findOne({walletAddress});
//         if (user) {
//             user.username = username;
//             await user.save();
//             return res.status(200).json({
//                 success: true,
//                 message: "Username updated successfully",
//                 user
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//     }
//     catch (error){
//         return res.status(500).json({
//             success: false,
//             message: "There is something occurring during the update of the username",
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// });
userRouter.post("/newuser", async (req: Request, res: Response) => {
    try {
        const { username, walletAddress} = req.body;
        const user = await User.create({
            username,
            walletAddress   
        });
        res.status(201).json({ 
            success: true, 
            message: "User created",
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error creating user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

userRouter.get("/message", async(req: Request, res: Response) => {
    const message = {
        message: "Sign in this message to verify your wallet address",
        nonce: Math.floor(Math.random() * 1000000),
        timestamp: new Date().getTime(),
    };
    res.send(message);
});

userRouter.post("/verify", async(req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { signature, address } = req.body;
        
        // if (!message || !signature || !address) {
        //     return res.status(400).json({ 
        //         success: false, 
        //         message: 'Missing required fields: message, signature, address' 
        //     });
        // }

        const signer = ethers.verifyMessage(message, signature);

        if (signer.toLowerCase() === address.toLowerCase()) {
            res.status(200).json({ success: true, message: "User is verified" });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid signature' 
            });
        }

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error verifying signature',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default userRouter;

