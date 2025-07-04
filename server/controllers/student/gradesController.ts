import { Request, Response } from "express";
import { storage } from "../../storage";

export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const grades = await storage.getAllGrades();
    const filtered = grades.filter(g => g.studentId === Number(studentId));
    const average = filtered.length > 0 ? (filtered.reduce((acc, g) => acc + Number(g.grade), 0) / filtered.length) : null;
    res.json({ average, subjects: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};