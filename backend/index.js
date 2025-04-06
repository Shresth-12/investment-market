import express from "express"
import rootRouter from "./routes/index.js"
import cors from "cors"
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./lib/socket.js";
import fileUpload from "express-fileupload";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
initSocket(io);
app.use(cors())
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded data limit
app.use(express.json());
app.use("/api/v1", rootRouter); // All requests to http://localhost:3000/api/v1/(any) goes to the rootRouter
server.listen(3000, () => {
    console.log("Server running on port",3000);
  });
  