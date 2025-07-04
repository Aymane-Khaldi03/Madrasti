import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorCourses = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    const courses = await storage.getAllCourses();
    const filtered = courses.filter(c => c.professorId === Number(professorId));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
