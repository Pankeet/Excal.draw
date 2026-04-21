"use client";
import  axios  from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputBox } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Signin(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) router.push('/my-profile');
        else return;
    },[router]);

    async function signin_req(){
        const toastId = toast.loading("Signing in...");
        if(username.trim() === "" || password.trim() === ""){
            alert("Please Enter the details to login !");
            return;
        }

        const data = {
            username, password
        }
        try{
            const res = await axios.post("http://localhost:8000/api/v1/signin", data);
            toast.success(res.data.message, {id: toastId});
            localStorage.setItem("token", res.data.token);
            router.push("/");        
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.message || "Something went wrong" , {id:toastId});
            } else {
                toast.error("Server not reachable!", {id:toastId});
            }
            console.error(e);
        }

    }
     return(
            <div className="w-screen h-screen grid place-content-center bg-bg dark:text-white">
                <div className="border rounded-xl p-10 bg-card shadow-lg">
                    <span className="lg:text-5xl md:text-2xl text-xl font-serif">Sign In</span>
                    <div className="mt-6">
                        <InputBox size="md" inputTitle="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <InputBox type="password" size="md" inputTitle="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter" && !e.shiftKey){
                                e.preventDefault();
                                signin_req();
                            }
                        }}/>
                    </div>
                     <span className="text-md mt-4 block cursor-help">
                        Does not have an account ? <Link href="/signup" className="text-purple-500">Sign Up</Link>
                    </span>
                    <div className="grid place-content-center mt-5">
                        <Button name="SignIn" variant="primary" size="lg" onClick={signin_req} />
                    </div>
                </div>
            </div>
        )
}