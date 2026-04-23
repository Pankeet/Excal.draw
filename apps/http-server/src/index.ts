import express , {type Express} from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import validate_user from "./middlewares/validate-user.js";
import { prisma } from "@repo/db-local/dist/config/prisma-config.js";
import { User, SiginSchema } from "./zod/types.js";

const app : Express = express();
app.use(express.json());

app.use(cors({
    origin : ["http://localhost:3000","https://excal-draw.vercel.app","https://excal-draw-3zcc0zgox-pankeets-projects.vercel.app","https://excal-draw-git-main-pankeets-projects.vercel.app"]
}));

if (!process.env.JWT_SECRET || !process.env.SALT_ROUNDS) {
  throw new Error("env vars are not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

// SignUp Endpoint Completed (✔️)
app.post("/api/v1/signup", async (req , res) => {
    const userDetails = User.safeParse(req.body);
    if(userDetails.success === false) {
        return res.status(422).json({
            message : "Invalid Semantics"
        });
    }   
    else{
        const { username, email, password } = userDetails.data;
        const findExsistence = await prisma.user.findUnique({where:{email:email}})
        if(findExsistence){
            return res.status(409).json({
                message : "User already Exsists !"
            })
        }   
        else{
            try{
                const hash_password = await bcrypt.hash(password , SALT_ROUNDS );
                await prisma.user.create({
                    data:{
                        username : username,
                        email : email,
                        password : hash_password
                    }
                });
                return res.status(201).json({
                    message : "User Created Successfully !"
                });
            }catch(err){
                console.error("SignUp Error :- ", err);
                return res.status(500).json({
                    message : "User cannot be created ! Please try again later "
                });
            }
        }
    }
});

// SigIn Endpoint Completed (✔️)
app.post("/api/v1/signin", async (req , res) => {
    const signDetails = SiginSchema.safeParse(req.body);
    if(signDetails.success === false) {
        return res.status(422).json({
            message : "Invalid Semantics"
        });
    }
    else{
        const { username, password } = signDetails.data;
        const findUser = await prisma.user.findMany({where : {username: username}});
        if(findUser.length === 0) return res.status(401).json({
            message : "User does not Exsists !"
        });
        else{
            for (const user of findUser){
                const password_cmp = await bcrypt.compare(password, user.password);
                if(password_cmp) {
                    const token = jwt.sign({userId : user.id,email : user.email},JWT_SECRET,{"expiresIn": '3d'});
                    return res.status(200).json({
                        message : "Signin Successful",
                        token : token
                    })
                }
            }
            return res.status(401).json({
                message : "Invalid Credentials !"
            });
        }
    }
});

// Get User Details for Profile
app.get('/api/v1/user-details', validate_user, async(req,res) => {
    const email = req.email;
    const userId = req.userId;

    try{
        const userDetails = await prisma.user.findUniqueOrThrow({
            where : {
                email : email,
                id : userId
            }
        });
        return res.status(200).json(userDetails);
    }catch(e){
        console.error(e);
        return res.status(404).json({
            message : "Cannot find User"
        })
    }
});

// Update user profile 
app.patch('/api/v1/profile-photo', validate_user, async (req,res) => {
    const photoUrl = req.body.photoUrl;
    const userId = req.userId;

    try{
        await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                avatar : photoUrl
            }
        })
        return res.status(200).json({
            message : "Profile Updated Succesfully !"
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message : "Cannot Update profile picture ! Please Try again later"
        });
    }
});

// Get all rooms users has Created
app.get('/api/v1/user-rooms/', validate_user, async (req,res) => {
    const userId = req.userId;

    try{
        const userRooms = await prisma.room.findMany({
            where : {
                adminId : userId
            }
        });

        return res.status(200).json(userRooms);

    }catch(err){
        console.error(err);
        return res.status(500).json({
            message : "Cannot load rooms ! Please Try again later"
        })
    }
});

// Delete Room 
app.delete('/api/v1/room/:slug', validate_user , async (req , res) => {
    const slug = req.params.slug as string;
    try{
        await prisma.room.delete({
            where : {
                slug : slug
            }
        })
        return res.status(200).json({
            message : `${slug} Deleted`
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message : "Cannot delete room ! Please Try again later"
        })
    }
});

// Room Creation Endpoint Completed (✔️)
app.post("/api/v1/create-room", validate_user, async (req , res) => {
    const userId = req.userId;
    const roomName  = req.body.slug;
    try{
        const create_room = await prisma.room.create({
            data:{
                slug : roomName,
                adminId : userId
            }
        })
        res.status(200).json({
            roomId : create_room.id
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message : "Cannot create room ! Please Try again later"
        })
    }
});

app.get('/api/v1/room/:slug', validate_user, async ( req , res) => {
    const slug = req.params.slug as string;
    try{
        const room = await prisma.room.findUnique({
            where : {
                slug : slug
            }
        });

        if (room) {
            return res.status(200).json({
                roomId : room.id
            });
        }
        else{
            return res.status(404).json({
                message: "Room not found !"
            });
        }
    }catch(e){
        console.error(e);
        return res.status(500).json({
            message : "Something Went Wrong !"
        })
    }
})

app.get('/api/v1/chats/:roomId',validate_user , async (req, res) => {
    const roomId = Number(req.params.roomId);
    try{
        const messages = await prisma.chat.findMany({
            where : {
                roomId : roomId
            },
            orderBy : { 
                id : "desc"
            },
            take : 20
        })

        return res.status(200).json({
            messages
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            message : "Failed to load messages !"
        })
}
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(8000, () => {
    console.log("Server running on port 8000");
  });
}