import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get all assignments for a course
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  // Get a specific assignment by ID
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  });

  // Create a new assignment
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  // Update an existing assignment
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
    res.json(status);
  });

  // Delete an assignment
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  });
} 