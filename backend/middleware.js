import { JWT_SECRET } from "./config.js"
import pkg from "jsonwebtoken";
import { User } from "./db.js";
import dotenv from "dotenv"
const { verify } = pkg;
dotenv.config()
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // takes the authorization token
    if (!authHeader || !authHeader.startsWith('Bearer ')) { // Should be in the form "Bearer token"
        return res.status(403).json({
            message:"Bearer Token Not found"
        });
    }
    const token = authHeader.split(' ')[1]; // gets the token from "Bearer token"
    try {
        const decoded =verify(token, JWT_SECRET); // checks if the token was made using the same JWT Secret or not
        req.userId = decoded.userId; // makes the req.userId to the decoded.userId
        next(); // If token was correct then moves to the next function otherwise gives error
    } catch (err) {
        return res.status(403).json({
            message:"Not authenticated"
        });
    }
};

const requireAdmin = async (req, res, next) => { // Used to check wheteher the mail of the user is admin o not
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message:"Bearer Token Not found"
        });
    }
    const token = authHeader.split(' ')[1];
	try {
        const decoded =verify(token, JWT_SECRET);
        const mail=await User.findById(decoded.userId)
        if(mail.email!=process.env.ADMIN_EMAIL) // If the mail is not the admin mail
        {
            return res.status(400).json({
                message:"Not authorized.Not an admin"
            })
        }
        req.userId = decoded.userId;
        req.email = decoded.email;
        next()
	} catch (error) {
		console.log(error)
        return res.status(403).json({
            message:"Not authenticated"
        });
	}
};
export {
    authMiddleware,
    requireAdmin
}