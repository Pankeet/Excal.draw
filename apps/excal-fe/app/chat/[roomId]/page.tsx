import RoomCanvas from "@/app/components/RoomCanvas";
export default async function ChatRoom({params} : Readonly<{
  params : Promise<{
    roomId : string
  }>
}>) {  
    const roomId = (await params).roomId;
    return (
       <RoomCanvas roomId={roomId} />
    );
}
