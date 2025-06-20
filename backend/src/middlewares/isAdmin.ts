import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (typeof req.user === 'object' && req.user !== null && 'role' in req.user) {
    if ((req.user as any).role === 'admin') {
      return next();
    }
  }

  res.status(403).json({ message: 'Acesso negado: apenas administradores' });
};
