import { JWT_SECRET } from "./config.js"
import pkg from "jsonwebtoken";
const { verify } = pkg;
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
export {
    authMiddleware
}