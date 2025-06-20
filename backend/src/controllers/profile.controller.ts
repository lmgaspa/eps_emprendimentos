import { Request, Response, NextFunction } from 'express'
import User from '../models/User'

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user as { id: string };
    const user = await User.findById(id).select('name email role');

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

