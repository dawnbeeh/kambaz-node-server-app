import "dotenv/config";
import express from "express";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js"; // Import CourseRoutes
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import cors from "cors";
import session from "express-session";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import mongoose from "mongoose";

const app = express();

// Debug: Check what NETLIFY_URL is set to
console.log("NETLIFY_URL environment variable:", process.env.NETLIFY_URL);

// Configure CORS before session
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.NETLIFY_URL,
      "https://dawnbeeh-kambaz.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

// Debug: Check environment and session configuration
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NODE_SERVER_DOMAIN:", process.env.NODE_SERVER_DOMAIN);

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    // Don't set domain if NODE_SERVER_DOMAIN is not set
    ...(process.env.NODE_SERVER_DOMAIN && { domain: process.env.NODE_SERVER_DOMAIN }),
  };
} else {
  // Development configuration
  sessionOptions.cookie = {
    sameSite: "lax",
    secure: false,
    httpOnly: true,
  };
}

console.log("Session options:", sessionOptions);

// Configure session before express.json
app.use(session(sessionOptions));

// Add request logging middleware
app.use((req, res, next) => {
  // Log method, URL, and timestamp
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Configure express.json before all routes
app.use(express.json());

// -----------------------------
//  MongoDB / Mongoose Setup
// -----------------------------
const DEFAULT_CONNECTION_STRING =
  "mongodb://127.0.0.1:27017/kambaz";

// Render or other platforms often expose connection string in these env vars
const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  DEFAULT_CONNECTION_STRING;

console.log("Connecting to MongoDB:", CONNECTION_STRING);

mongoose
  .connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅  MongoDB connection established"))
  .catch((e) => console.error("❌  MongoDB connection error:", e));

// Define routes
UserRoutes(app);
CourseRoutes(app); // Add CourseRoutes
EnrollmentRoutes(app);
AssignmentRoutes(app);
ModuleRoutes(app);
Lab5(app);

// Global error-handling middleware (should be registered after all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Avoid leaking stack traces in production
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.listen(4000); // Use fixed port 4000