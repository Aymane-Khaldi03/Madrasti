import { Request, Response } from "express";
import { storage } from "../../storage";

export const getProfessorAssignments = async (req: Request, res: Response) => {
  try {
    const professorId = req.query.professorId as string;
    if (!professorId) return res.status(400).json({ error: 'professorId is required' });
    // Récupérer tous les cours du professeur
    const courses = await storage.getAllCourses();
    const courseIds = courses.filter(c => c.professorId === Number(professorId)).map(c => c.id);
    // Récupérer tous les devoirs
    const assignments = await storage.getAllAssignments();
    // Filtrer les devoirs de ces cours
    const filtered = assignments.filter(a => courseIds.includes(a.courseId));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};
