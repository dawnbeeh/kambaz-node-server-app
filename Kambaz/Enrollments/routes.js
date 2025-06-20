import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Enroll a user in a course
  app.post("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await dao.enrollUserInCourse(userId, courseId);
    res.json(status);
  });

  // Unenroll a user from a course
  app.delete("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await dao.unenrollUserFromCourse(userId, courseId);
    res.json(status);
  });

  // Get all enrollments for a user
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    const { userId } = req.params;
    const enrollments = await dao.findEnrollmentsByUserId(userId);
    res.json(enrollments);
  });
} 