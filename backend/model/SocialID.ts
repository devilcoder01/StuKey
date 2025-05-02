import mongoose, { Document, Schema } from "mongoose";
import { Url } from "url";


interface SocialIDs extends Document {
    twitter: Url,
    linkedin : Url,
    instagram: Url,
}