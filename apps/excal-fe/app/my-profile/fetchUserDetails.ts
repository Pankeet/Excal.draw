import axios from "axios";
import toast from "react-hot-toast";

export async function getUserRoomDetails(token : string | null){
     const toastRoom = toast.loading("Loading the User's rooms !");
        try{
            const res = await axios.get("https://excal-draw-http-server.onrender.com/api/v1/user-rooms", {
                headers : {
                    Authorization : token
                }
            });
            toast.success("",{id: toastRoom});
            return res.data;
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.message || "Something went wrong" , {id:toastRoom});
            } else {
                toast.error("Server not reachable!", {id:toastRoom});
            }
            console.error(e);
            return null;
        }
}

export async function getUserDetails(token : string | null){
    const toastProfile = toast.loading("Loading User Profile.....")
        try{
            const res = await axios.get("https://excal-draw-http-server.onrender.com/api/v1/user-details", {
                headers : {
                    Authorization : token
                }
            });
            toast.success("",{id:toastProfile});
            return res.data;
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.message || "Something went wrong" , {id:toastProfile});
            } else {
                toast.error("Server not reachable!", {id:toastProfile});
            }
            console.error(e);
            return null;
            }
        }