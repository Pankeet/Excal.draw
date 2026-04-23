-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
