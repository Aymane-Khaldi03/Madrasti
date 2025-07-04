import { Request, Response } from "express";
import { storage } from "../../storage";

export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const enrollments = await storage.getAllEnrollments();
    const courseIds = enrollments.filter(e => e.studentId === Number(studentId)).map(e => e.courseId);
    const courses = await storage.getAllCourses();
    const filtered = courses.filter(c => courseIds.includes(c.id));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};