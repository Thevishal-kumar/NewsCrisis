// routes/report.routes.js
import express from "express";

const router = express.Router();

// Health-check / test route
router.get("/test", (req, res) => {
  console.log("🔥 /api/v1/reports/test hit");
  res.json({ success: true, message: "Report route working!" });
});

// Example base route
router.get("/", (req, res) => {
  res.json({ items: [] });
});

export default router;
