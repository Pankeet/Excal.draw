import { WebSocketServer, type WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db-local/config/prisma-config.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

interface DecodedToken {
  userId: string;
  email: string;
}

type ClientMessage =
    | { type: "join"; roomId: string }
    | { type: "leave"; roomId: string }
    | { type: "chat"; roomId: string; message: string };

type UserData = {
  sockets: Set<WebSocket>;
  rooms: Set<string>;
};

const wss = new WebSocketServer({ port: 8080 });

const users = new Map<string, UserData>();
const rooms = new Map<string, Set<string>>();

function sendError(ws: WebSocket, message: string) {
  ws.send(JSON.stringify({ type: "error", message }));
}

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET || "no-secret") as DecodedToken;
    return decoded?.userId ?? null;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
} 

function handleJoin(ws: WebSocket, userId : string, user : UserData, roomId: string){
  let room = rooms.get(roomId);
  if(room){
     ws.send(JSON.stringify({
      type: "joined",
      roomId,
    }));
  }
  else{
    room = new Set();
    rooms.set(roomId, room);

    ws.send(JSON.stringify({
      type: "created",
      roomId,
    }));
  }

  room.add(userId);
  user.rooms.add(roomId);
}

function handleLeave(ws : WebSocket, userId : string, user : UserData, roomId : string){
  const room = rooms.get(roomId);
  if (!room) {
        sendError(ws, "Room does not exist");
        return;
      }

      if (!user.rooms.has(roomId)) {
        sendError(ws, "You are not in the room");
        return;
      }

      room.delete(userId);
      user.rooms.delete(roomId);

      ws.send(JSON.stringify({ type: "left", roomId: roomId }));
}

async function handleChat(ws : WebSocket, userId : string, user : UserData, roomId : string, message : string){
  if (!user.rooms.has(roomId)) {
    return sendError(ws, "Join room first");
  }

  const roomUsers = rooms.get(roomId);
  if (!roomUsers) {
    return sendError(ws, "Room does not exist");
  }

  try{
    const msg = JSON.parse(message);
    if(msg.width === 0 || msg.heigth === 0 || msg.radius === 0) return;
  }catch(e){
    console.error(e);
    return sendError(ws, "Invalid message format");
  }
  try{
    await prisma.chat.create({
        data : {
          message : message,
          userId : userId,
          roomId : Number(roomId)
        }
    })
  }catch (e) {
    console.error(e);
    return sendError(ws, "Cannot send message");
  }

  broadcast(roomUsers, {
    type: "chat",
    from: userId,
    roomId,
    message,
  });
}

function broadcast(roomUsers: Set<string>, payload: any) {
  for (const uid of roomUsers) {
    const targetUser = users.get(uid);
    if (!targetUser) continue;

    for (const socket of targetUser.sockets) {
      socket.send(JSON.stringify(payload));
    }
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }

  const existingUser = users.get(userId);

if (existingUser) {
  existingUser.sockets.add(ws);
} else {
  users.set(userId, {
    sockets: new Set([ws]),
    rooms: new Set(),
  });
}

  ws.on("message", async (data) => {
    handleMessage(ws,userId,data);

  ws.on("close", () => {
    const user = users.get(userId);
    if (!user) return;
    user.sockets.delete(ws);

    if (user.sockets.size === 0) {
      for (const roomId of user.rooms) {
        rooms.get(roomId)?.delete(userId);
      }
      users.delete(userId);
    }
  });
  });
});

async function handleMessage(ws: WebSocket, userId : string , data : any){
  const user = users.get(userId);
  if (!user) return;

  let parseData: ClientMessage;

  try {
    parseData = JSON.parse(data.toString());
  }catch {
    sendError(ws, "Invalid JSON");
    return;
  }

  switch (parseData.type){
    case "join":
      return handleJoin(ws, userId, user, parseData.roomId);
    case "leave":
      return handleLeave(ws, userId, user, parseData.roomId);
    case "chat":
      return handleChat(ws, userId, user, parseData.roomId , parseData.message);
    default:
      return sendError(ws, "Unknown message type");
  }
}