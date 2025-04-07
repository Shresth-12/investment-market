import express from "express";
import { Deal, User } from "../db.js";
import { authMiddleware, requireAdmin } from "../middleware.js";


const router = express.Router();

router.get("/user-stats",authMiddleware,requireAdmin, async (req, res) => {
  try {
    // Get all users and compute stats
    const users = await User.find();

    const userStats = await Promise.all(
      users.map(async (user) => {
        const totalDeals = await Deal.countDocuments({ seller: user._id });
        const completedDeals = await Deal.countDocuments({ seller: user._id, status: "Completed" });
        const pendingDeals = await Deal.countDocuments({ seller: user._id, status: "Pending" });

        return {
          name: user.fullName,
          email: user.email,
          role: user.role,
          totalDeals,
          completedDeals,
          pendingDeals,
        };
      })
    );

    // Global deal stats
    const totalDeals = await Deal.countDocuments();
    const pending = await Deal.countDocuments({ status: "Pending" });
    const completed = await Deal.countDocuments({ status: "Completed" });
    const cancelled = await Deal.countDocuments({ status: "Cancelled" });
    const inProgress = await Deal.countDocuments({ status: "In Progress" });

    const dealStats = {
      totalDeals,
      pending,
      completed,
      cancelled,
      inProgress,
    };

    res.status(200).json({ userStats, dealStats });
  } catch (error) {
    console.error("Error in /admin/user-stats:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/check",requireAdmin,async(req,res)=>{ // Check if user is admin or not
    res.status(200).json({
        admin:"True"
    })
})

export default router;
