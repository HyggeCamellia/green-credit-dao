import jwt from 'jsonwebtoken'
import { config } from '@/config'

export interface JwtPayload {
  userId: string
  role: string
  username: string
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE as string | number,
  } as jwt.SignOptions)
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JwtPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const getTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}
