import express from "express"
import userrouter from "./user.js"
import dealrouter from "./deal.js"
import adminrouter from "./admin.js"
const router=express.Router()
router.use("/user",userrouter) // All the req to /api/v1/user goes to userrouter
router.use("/deal",dealrouter) // All the req to /api/v1/deal goes to dealrouter
router.use("/admin",adminrouter) // All the req to /api/v1/admin goes to adminrouter
export default router;