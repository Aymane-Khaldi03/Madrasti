import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorStudents = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    // Récupérer tous les cours du professeur
    const courses = await storage.getAllCourses();
    const courseIds = courses.filter(c => c.professorId === Number(professorId)).map(c => c.id);
    // Récupérer tous les enrollments de ces cours
    const enrollments = await storage.getAllEnrollments();
    const studentIds = enrollments.filter(e => courseIds.includes(e.courseId)).map(e => e.studentId);
    // Récupérer tous les users étudiants
    const users = await storage.getAllUsers();
    const students = users.filter(u => u.role === 'student' && studentIds.includes(u.id));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
