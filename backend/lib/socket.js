import { Message, User } from "../db.js";

export const initSocket = (io) => { // Used to initialise socket connection
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id); // When a user connects it console log its socket.id

    socket.on("join-deal", (dealId) => { // Used to joina particular deal chat room
      socket.join(dealId);
      console.log(`Socket ${socket.id} joined deal ${dealId}`);
    });

    socket.on("send-message", async ({ dealId, senderId, text, priceOffered }) => { // Creates a new message
      try {
        const newMessage = new Message({
          dealId,
          sender: senderId,
          text,
          priceOffered,
        });

        await newMessage.save(); // save the message in db

        const senderUser = await User.findById(senderId); // get the sender details

        io.to(dealId).emit("receive-message", { // shows the creted message to all the users in the deal room
          _id: newMessage._id,
          sender: senderId,
          fullName: senderUser.fullName,
          text,
          priceOffered,
          timestamp: newMessage.timestamp,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });
    socket.on("user-typing", (dealId, senderId) => {
      socket.to(dealId).emit("show-typing", senderId); // Notify others thet the user is typing
    });
    
    socket.on("user-stop-typing", (dealId, senderId) => {
      socket.to(dealId).emit("hide-typing", senderId); // Notify others that the user is not typing
    });
    socket.on("message-read", async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.read = true;
          await message.save();
          io.to(message.dealId).emit("update-message-read-status", messageId);
        }
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    });
        

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
