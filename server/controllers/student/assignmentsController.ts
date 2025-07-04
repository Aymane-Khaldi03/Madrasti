import { Request, Response } from "express";
import { storage } from "../../storage";

export const getStudentAssignments = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    // Récupérer tous les enrollments de l'étudiant
    const enrollments = await storage.getAllEnrollments();
    const courseIds = enrollments.filter(e => e.studentId === Number(studentId)).map(e => e.courseId);
    // Récupérer tous les devoirs
    const assignments = await storage.getAllAssignments();
    // Filtrer les devoirs des cours où il est inscrit
    const filtered = assignments.filter(a => courseIds.includes(a.courseId));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Firestore', details: err });
  }
};