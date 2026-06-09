import { Request, Response, NextFunction } from 'express'
import { getTokenFromHeader, verifyToken } from '@/utils/jwt'
import { unauthorizedResponse } from '@/utils/response'

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization)

    if (!token) {
      res.status(401).json(unauthorizedResponse('Missing token'))
      return
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error: any) {
    res.status(401).json(unauthorizedResponse(error.message))
  }
}

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        code: 403,
        message: 'Forbidden: Insufficient permissions',
      })
      return
    }
    next()
  }
}
