import { z } from "zod";

export const User = z.object({
    username : z.string(),
    email : z.email().trim(),
    password : z.string().trim().min(5)
})

export const SiginSchema = z.object({
    username : z.string().trim(),
    password : z.string().trim().min(5)
})

export const CreateRoomSchema = z.object({
    name : z.string().trim()
})
