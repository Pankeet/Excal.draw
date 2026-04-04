import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-secret/dist/index.js";
import jwt from "jsonwebtoken";

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
            next();
        }
    }catch(err){
        console.log(err);
        return res.status(400).json({
            message : "Unauthorized !"
        });
    }
}