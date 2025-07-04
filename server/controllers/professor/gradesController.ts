import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorGrades = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    const courses = await storage.getAllCourses();
    const courseIds = courses.filter(c => c.professorId === Number(professorId)).map(c => c.id);
    const grades = await storage.getAllGrades();
    const filtered = grades.filter(g => courseIds.includes(g.courseId));
    const average = filtered.length > 0 ? (filtered.reduce((acc, g) => acc + Number(g.grade), 0) / filtered.length) : null;
    res.json({ average, subjects: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
