import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { paymentMiddleware } from 'x402-express';
// import { facilitator } from '@coinbase/x402';

const app = express();
app.use(cors({
    origin: ['http://localhost:5173',
    "https://news-crisis.vercel.app"
    ],
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    next();
});

// Import route modules
import userRoute from "./routes/user.routes.js";
import verifyRoute from "./routes/verify.routes.js";
import reportRoute from "./routes/report.routes.js";

// Mount routes
app.use("/api/v1/users", userRoute);

app.use("/api/v1/reports", reportRoute);

app.use("/api/v1/verify", verifyRoute);

app.use(express.static("public"));

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { app };
