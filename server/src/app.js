// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { paymentMiddleware } from 'x402-express';
// import { facilitator } from '@coinbase/x402';

const app = express();

console.log("✅ Server.js starting...");

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
console.log("✅ CORS middleware mounted");

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log("✅ Body parsers & cookieParser mounted");

// Debug every request
app.use((req, res, next) => {
    console.log(`👉 Incoming request: ${req.method} ${req.url}`);
    next();
});

// Import route modules
import userRoute from "./routes/user.routes.js";
import verifyRoute from "./routes/verify.routes.js";
import reportRoute from "./routes/report.routes.js";

console.log("✅ Routes imported:");
console.log("   userRoute:", typeof userRoute);
console.log("   verifyRoute:", typeof verifyRoute);
console.log("   reportRoute:", typeof reportRoute);

// Mount routes
app.use("/api/v1/users", userRoute);
console.log("✅ Mounted /api/v1/users route");

app.use("/api/v1/reports", reportRoute);
console.log("✅ Mounted /api/v1/reports route");

app.use("/api/v1/verify", verifyRoute);
console.log("✅ Mounted /api/v1/verify route");

// Serve static
app.use(express.static("public"));
console.log("✅ Serving static files from /public");

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app };
