import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/dbconnection.js";
import authRoutes from "./src/routes/auth.routes.js";
import issueRoutes from "./src/routes/issue.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import {
    securityHeaders,
    apiLimiter,
    authLimiter,
    sanitizeInput,
} from "./src/middleware/auth.middleware.js";

dotenv.config();

const app = express();

connectDB();

app.use(securityHeaders);

const allowedOrigins = [
    process.env.CLIENT_URI,
    process.env.FRONTEND_URI,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

            if (isAllowed) {
                callback(null, true);
            } else {
                console.warn(`[CORS Blocked] Request from origin: ${origin}`);
                callback(null, false);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(sanitizeInput);

app.use("/api", apiLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Smart city Resolve Issue API is Secured & Running",
        security: "Helmet, Ratelimiting, NoSQLSanitization, RBAC, JWT Active",
        endpoints: {
            auth: "/api/auth",
            issues: "/api/issues",
            departments: "/api/departments",
            analytics: "/api/analytics",
            notifications: "/api/notifications",
            users: "/api/users",
            upload: "/api/upload",
        },
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});