import axios from "axios";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { RoomDetails } from "./ProfilePageTypes";

type props = Readonly<{
    roomDetails : RoomDetails[] | null,
    token : string,
    getUserRoomDetails : () => Promise<void>
}>

async function deleteThisRoom(slug : string, token: string ){
    const deleteToast = toast.loading("Deleting Room ...");        
    try{
        const res = await axios.delete(`https://excal-draw-http-server.onrender.com/api/v1/room/${slug}`,{
            headers : {
                Authorization : token
            }
        });
        toast.success(res.data.message , {id : deleteToast});
        return true;
    }catch (e: unknown) {
                if (axios.isAxiosError(e)) {
                    toast.error(e.response?.data?.message || "Something went wrong" , {id:deleteToast});
                } else {
                    toast.error("Server not reachable!", {id:deleteToast});
                }
                console.error(e);
                return false;
            }
}

export default function RoomList({roomDetails,token, getUserRoomDetails} : props){

    return (
        <table className="mt-6 w-full text-center border-separate border-spacing-y-4 dark:text-black">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Delete</th>    
                </tr>
            </thead>
            <tbody>
                {roomDetails?.map((room) => (
                    <tr key={room.slug}>
                        <td>
                            {room.slug}
                        </td>
                        <td>
                            {room.createdAt.toLocaleString()}
                        </td>
                        <td>
                            <button onClick={async () => {
                                        const isDeleted = await deleteThisRoom(room.slug,token);
                                        if(isDeleted) getUserRoomDetails();
                                    }} 
                                    className="text-red-500 cursor-pointer">
                                        <FaTrashAlt />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
       </table>
    )
}