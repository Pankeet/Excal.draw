import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
interface Decoder {
    userId: string;
    email: string;
}

export default function validate_user(req : Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"] || "";

    try{
        const decode = jwt.verify(token,JWT_SECRET) as Decoder;
        if(decode){
            req.userId = decode.userId ;
            req.email = decode.email;
            next();
        }
    }catch(err){
        console.log(err);
        return res.status(400).json({
            message : "Unauthorized ! Please Log in again "
        });
    }
}