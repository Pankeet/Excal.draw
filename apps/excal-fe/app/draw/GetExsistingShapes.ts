import axios from "axios";
import { Shape } from "./Shape";

export async function getexsistingShapes(roomId : string , token : string ) : Promise<Shape []> {
    const res = await axios.get(`https://excal-draw-http-server.onrender.com/api/v1/chats/${roomId}`,{
        headers: {
            Authorization: token
        }
    });
    
    const messages = res.data?.messages || [];

    try{
      const shapes = messages.map((x : {message : string}) => {
          const messageData = JSON.parse(x.message);
          return messageData;
      });
      return shapes;
    }catch(e){
    console.error(e);
    alert("Sorry ! We are unable to fetch the older chats at the moment !");
    return [];
  }
}