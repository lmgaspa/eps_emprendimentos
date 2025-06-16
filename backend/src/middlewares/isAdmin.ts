import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;

  // Garantir que é um JwtPayload e que tem a propriedade 'role'
  if (
    typeof user !== 'object' ||
    user === null ||
    !('role' in user) ||
    (user as JwtPayload).role !== 'admin'
  ) {
    res.status(403).json({ message: 'Acesso negado: apenas administradores' });
    return;
  }

  next();
};
