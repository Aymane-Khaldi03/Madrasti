import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from './controllers/admin/usersController';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from './controllers/admin/coursesController';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from './controllers/admin/announcementsController';
import {
  getReportByUser,
  getReportByClass,
  exportReports
} from './controllers/admin/reportsController';
import {
  getEvents,
  createEvent,
  deleteEvent
} from './controllers/admin/calendarController';
import {
  getNotifications,
  createNotification
} from './controllers/admin/notificationsController';
import { checkAdminAuth } from './firebase-admin';

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // In a real implementation, this would verify credentials with Firebase
      // For now, we'll just return a mock response based on predefined users
      const user = await storage.getUserByEmail(email);
      
      // Mock password verification - in production this would be handled by Firebase Auth
      const validCredentials = (
        (email === "student@example.com" && password === "student123") ||
        (email === "professor@example.com" && password === "professor123") ||
        (email === "admin@example.com" && password === "admin123")
      );
      
      if (user && validCredentials) {
        res.json({ 
          success: true, 
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
          } 
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(parseInt(req.params.id));
      if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Course management routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const course = await storage.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.updateCourse(parseInt(req.params.id), req.body);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const success = await storage.deleteCourse(parseInt(req.params.id));
      if (!success) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Assignment routes
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const assignment = await storage.createAssignment(req.body);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Submission routes
  app.get("/api/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const submission = await storage.createSubmission(req.body);
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollment = await storage.createEnrollment(req.body);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  // --- ADMIN ROUTES ---
  // Users
  app.get('/admin/users', checkAdminAuth, getUsers);
  app.post('/admin/users', checkAdminAuth, createUser);
  app.put('/admin/users/:id', checkAdminAuth, updateUser);
  app.delete('/admin/users/:id', checkAdminAuth, deleteUser);

  // Courses
  app.get('/admin/courses', checkAdminAuth, getCourses);
  app.post('/admin/courses', checkAdminAuth, createCourse);
  app.put('/admin/courses/:id', checkAdminAuth, updateCourse);
  app.delete('/admin/courses/:id', checkAdminAuth, deleteCourse);

  // Announcements
  app.get('/admin/announcements', checkAdminAuth, getAnnouncements);
  app.post('/admin/announcements', checkAdminAuth, createAnnouncement);
  app.put('/admin/announcements/:id', checkAdminAuth, updateAnnouncement);
  app.delete('/admin/announcements/:id', checkAdminAuth, deleteAnnouncement);

  // Reports
  app.get('/admin/reports/by-user/:id', checkAdminAuth, getReportByUser);
  app.get('/admin/reports/by-class/:id', checkAdminAuth, getReportByClass);
  app.get('/admin/reports/export', checkAdminAuth, exportReports);

  // Calendar
  app.get('/admin/events', checkAdminAuth, getEvents);
  app.post('/admin/events', checkAdminAuth, createEvent);
  app.delete('/admin/events/:id', checkAdminAuth, deleteEvent);

  // Notifications
  app.get('/admin/notifications', checkAdminAuth, getNotifications);
  app.post('/admin/notifications', checkAdminAuth, createNotification);

  const httpServer = createServer(app);
  return httpServer;
}
