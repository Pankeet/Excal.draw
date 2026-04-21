"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { InputBox } from "@repo/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUp(){
    const [username, setusername] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const router = useRouter();
    
    async function signup_req(){
        const toastId = toast.loading("Creating User.....")
        if(username.trim() === "" || password.trim() === "" || email.trim() === ""){
            alert("Please enter the details to Sign Up !");
            return;
        }
        const data = { username , email , password};
        try{
            const res = await axios.post("https://excal-draw-http-server.onrender.com/api/v1/signup", data);
            toast.success(res.data.message, {id : toastId});
            router.push("/");
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.message || "Something went wrong", {id:toastId});
            } else {
                toast.error("Server not reachable!",{id:toastId});
            }
            console.error(e);
        }
    }
    
    return(
        <div className="w-screen h-screen grid place-content-center bg-linear-to-t from-card to-bg">
            <div className="border rounded-xl py-8 px-9 bg-card shadow-lg">
                <span className="lg:text-4xl md:text-2xl text-xl font-serif">Sign Up</span>
                <div className="mt-6" >
                    <InputBox inputTitle="Username :" type="text" placeholder="John_Doe" size="md" value={username} onChange={(e) => setusername(e.target.value)} />
                    <InputBox  inputTitle="Email :" type="email" placeholder="johndoe@zohomail.com" size="md" value={email} onChange={(e) => setemail(e.target.value)}/>
                    <InputBox inputTitle="Password :" type="password" placeholder="#johnDoe123" size="md" value={password} onChange={(e) => setpassword(e.target.value)} 
                        onKeyDown={(e) => {
                            if(e.key === "Enter" && !e.shiftKey){
                                e.preventDefault();
                                signup_req();
                            }
                        }}/>
                </div>
                <span className="text-md mt-4 block cursor-help">
                    Already have account ? <Link href="/signin" className="text-purple-500">Login</Link>
                </span>
                <div className="grid place-content-center mt-5">
                    <Button name="SignUp" variant="primary" size="lg" onClick={signup_req} />
                </div>
            </div>
        </div>
    )
}