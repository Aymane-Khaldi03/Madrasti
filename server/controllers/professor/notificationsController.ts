import { Request, Response } from "express";

export const getProfessorNotifications = (req: Request, res: Response) => {
  // TODO: Fetch notifications for the professor from the database
  res.json([
    { title: "Meeting Reminder", message: "Department meeting at 3pm.", date: "2025-07-05", read: false },
    { title: "New Assignment", message: "You have a new assignment to review.", date: "2025-07-04", read: true },
  ]);
};
