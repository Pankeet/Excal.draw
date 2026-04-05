"use client";
import { useState } from "react";
import  axios  from "axios";
import { useRouter } from "next/navigation";
import { InputBox } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export default function Signin(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function signin_req(){
        const data = {
            username, password
        }
        try{
            const res = await axios.post("http://localhost:8000/api/v1/signin", data);
            alert(res.data.message);
            localStorage.setItem("token", res.data.token);
            router.push("/");        
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                alert(e.response?.data?.message || "Something went wrong");
            } else {
                alert("Server not reachable!");
            }
            console.error(e);
        }

    }
     return(
            <div className="w-screen h-screen grid place-content-center bg-bg">
                <div className="border rounded-xl p-10 bg-card shadow-lg">
                    <span className="lg:text-5xl md:text-2xl text-xl font-serif">Sign In</span>
                    <div className="mt-6">
                        <InputBox size="md" inputTitle="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <InputBox type="password" size="md" inputTitle="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
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