import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Enroll a user in a course
  app.post("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.enrollUserInCourse(userId, courseId);
    res.json({ message: "Enrolled successfully" });
  });

  // Unenroll a user from a course
  app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.json({ message: "Unenrolled successfully" });
  });

  // Get all enrollments for a user
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsByUserId(userId);
    res.json(enrollments);
  });
} 