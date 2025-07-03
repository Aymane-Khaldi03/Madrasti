import { Request, Response } from 'express';

export const getCourses = async (req: Request, res: Response) => {
  // TODO: Récupérer la liste des cours
  res.json([]);
};

export const createCourse = async (req: Request, res: Response) => {
  // TODO: Créer un nouveau cours
  res.status(201).json({ message: 'Cours créé' });
};

export const updateCourse = async (req: Request, res: Response) => {
  // TODO: Mettre à jour un cours
  res.json({ message: 'Cours mis à jour' });
};

export const deleteCourse = async (req: Request, res: Response) => {
  // TODO: Supprimer un cours
  res.json({ message: 'Cours supprimé' });
}; 