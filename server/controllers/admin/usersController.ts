import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  // TODO: Récupérer la liste des utilisateurs depuis la base de données
  res.json([]);
};

export const createUser = async (req: Request, res: Response) => {
  // TODO: Créer un nouvel utilisateur
  res.status(201).json({ message: 'Utilisateur créé' });
};

export const updateUser = async (req: Request, res: Response) => {
  // TODO: Mettre à jour un utilisateur existant
  res.json({ message: 'Utilisateur mis à jour' });
};

export const deleteUser = async (req: Request, res: Response) => {
  // TODO: Supprimer un utilisateur
  res.json({ message: 'Utilisateur supprimé' });
}; 