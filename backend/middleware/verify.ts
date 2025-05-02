import express, { NextFunction, Request, Response, Router } from "express";
import { ethers } from 'ethers';

const verifyHandler: any = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        const { signature, address } = req.body;
        
        if (!message || !signature || !address) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: message, signature, address' 
            });
        }

        const signer = ethers.verifyMessage(message, signature);

        if (signer.toLowerCase() === address.toLowerCase()) {
            res.status(200).json({ success: true, message: "User is verified" });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid signature' 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error verifying signature',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export default verifyHandler;