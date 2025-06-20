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

// Configure express.json before all routes
app.use(express.json());

// Define routes
UserRoutes(app);
CourseRoutes(app); // Add CourseRoutes
EnrollmentRoutes(app);
AssignmentRoutes(app);
ModuleRoutes(app);
Lab5(app);

app.listen(4000); // Use fixed port 4000