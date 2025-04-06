import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { SendHorizonal } from "lucide-react";

const socket = io("http://localhost:3000");

const DealChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [priceOffered, setPriceOffered] = useState("");
  const [file, setFile] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const bottomRef = useRef(null);
  const[User,setUser]=useState(null)

  const token = localStorage.getItem("token");
  const senderId = JSON.parse(atob(token.split(".")[1])).userId;
  async function Details(id)
  {
    try {
      const user=await axios.get("http://localhost:3000/api/v1/user/details",{
        id
      })
      setUser(user)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!id) return;

    socket.emit("join-deal", id);

    axios
      .get(`http://localhost:3000/api/v1/deal/deal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data.messages || []);
      });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("show-typing", (typingId) => {
      if (typingId !== senderId) {
        setTypingUsers((prev) => [...new Set([...prev, typingId])]);
      }
    });

    socket.on("hide-typing", (stopTypingId) => {
      setTypingUsers((prev) => prev.filter((id) => id !== stopTypingId));
    });
    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [id, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let typingTimeout;
  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("user-typing", id, senderId);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("user-stop-typing", id, senderId);
    }, 1000);
  };
  const sendMessage = async () => {
    if (!text.trim() && !priceOffered.trim() && !file) return;

    const formData = new FormData();
    formData.append("dealId", id);
    formData.append("text", text);
    if (priceOffered) formData.append("priceOffered", priceOffered);
    if (file) formData.append("file", file);

    socket.emit("send-message", {
      dealId: id,
      senderId,
      text,
      priceOffered,
      file: !!file,
    });

    try {
      await axios.post("http://localhost:3000/api/v1/deal/message", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(messages)
      setText("");
      setPriceOffered("");
      setFile(null);
      socket.emit("stop-typing", { dealId: id, senderId });
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 Deal Chat</h1>

      <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto space-y-3 bg-white shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-lg max-w-sm ${
              msg.sender === senderId ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">
              {msg.sender?.fullName || "Unknown"} •{" "}
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-sm">{msg.text}</p>
            {msg.priceOffered && (
              <p className="text-sm text-blue-600 mt-1">
                💰 Offer: ₹{msg.priceOffered}
              </p>
            )}
            {msg.file && (
              <div className="mt-2">
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file) ? (
                  <img
                    src={msg.file}
                    alt="uploaded"
                    className="max-w-xs max-h-60 rounded shadow-md"
                  />
                ) : (
                  <a
                    href={msg.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline block"
                  >
                    📎 View File
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {typingUsers.length > 0 && (
          <p className="text-sm italic text-gray-500">
            {typingUsers.length === 1
              ? "Someone is typing..."
              : "Multiple users are typing..."}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-6 items-center">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          value={priceOffered}
          onChange={(e) => setPriceOffered(e.target.value)}
          placeholder="Offer ₹"
          className="w-32 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full md:w-auto"
        />
        <button
          onClick={sendMessage}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <SendHorizonal size={16} />
          Send
        </button>
      </div>
    </div>
  );
};

export default DealChat;
