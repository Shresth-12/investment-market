import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DB_URL);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"], // For safety so that user can't add anything except buyer or seller as a role in db 
    },
  },
  { timestamps: true } // Give info thgat when it was creted and Updated
);
const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"], // For safety so that user can't add anything except "Pending", "In Progress", "Completed", "Cancelled" as a status in db 
      default: "Pending",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId, // Buyer id gets updated if any buyer gets the deal
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId, // Seller id: Id of the seller who posted the deal
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Give info thgat when it was creted and Updated
);
const messageSchema = new mongoose.Schema({
    dealId: {
      type: mongoose.Schema.Types.ObjectId, // Id of the deal (Used to create a deal Chat room of a prticular deal)
      ref: "Deal",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,  //SenderId: Id of the sender
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    priceOffered: {
      type: Number,
    },
    timestamp: { // Give info thgat when it was creted and Updated
      type: Date,
      default: Date.now,
    },
    file:{
      type:String // Url from Cloudinary
  }
  });
  
export const Message = mongoose.model("Message", messageSchema);
export const Deal = mongoose.model("Deal", dealSchema)
export const User = mongoose.model("User", userSchema);
