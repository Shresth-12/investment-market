import express from "express";
import { authMiddleware } from "../middleware.js"; // To check if user is authenticated or not
import { Deal, Message, User } from "../db.js";
import cloudinary from "../lib/cloudinary.js"; // Cloudinary to store the files or images

const router = express.Router();

router.post("/deal", authMiddleware, async (req, res) => { //Used to create deal if user is authenticated
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deal = await Deal.create({ // creates deal in db
      title,
      description,
      price,
      seller: req.userId,
    });

    res.status(200).json(deal); // sends the created deal in the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while posting deal" });
  }
});

router.get("/deals", authMiddleware, async (req, res) => { // To get all the deals in the db if user is authenticated
  try {
    const deals = await Deal.find().populate("seller", "fullName email"); // Get all the deals and replaces the seller Id with the seller info but only include email and fullName 
    res.status(200).json(deals); // sends all the deals in the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});

// Get a single deal + all messages for that deal
router.get("/deal/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Looking for deal ID:", req.params.id);
    const deal = await Deal.findById(req.params.id).populate("seller", "fullName email"); // Get the deal by id and replaces the seller Id with the seller info but only include email and fullName 
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    const messages = await Message.find({ // Get all the messages related to that deal
      dealId: req.params.id,
    }).sort({ timestamp: 1 }); // Include all messages, not just user’s

    res.status(200).json({ deal, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch deal and messages" });
  }
});

// Send a new message
router.post("/message", authMiddleware, async (req, res) => {
  try {
    const { dealId, text, priceOffered } = req.body;

    if (!dealId || !text) {
      return res.status(400).json({ message: "Deal ID and text are required" });
    }
    let fileUrl;
    if (req.files?.file || req.body.file) { // gets the file uploaded by the user
      const uploadResponse = await cloudinary.uploader.upload( // gets the url of the file uploaded on cloudinary
        req.files?.file?.tempFilePath || req.body.file,
        { resource_type: "auto" }
      );
      fileUrl = uploadResponse.secure_url;
    }

    const newMsg = await Message.create({ // creates the new message
      dealId,
      text,
      sender: req.userId,
      priceOffered,
      timestamp: new Date(),
      file:fileUrl
    });

    const fullMsg = await Message.findById(newMsg._id).populate("sender", "fullName email"); // sends the sender info for the frontend

    res.status(201).json(fullMsg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.put("/accept/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a deal → sets status to "Cancelled"
router.put("/reject/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
