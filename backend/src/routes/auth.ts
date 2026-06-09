import { Router, Response } from 'express'
import { AuthRequest, authMiddleware } from '@/middleware/auth'
import { successResponse, validationErrorResponse } from '@/utils/response'
import { generateToken } from '@/utils/jwt'
import { hashPassword, verifyPassword } from '@/utils/crypto'
import * as authService from '@/services/authService'

const router: Router = Router()

/**
 * 用户注册
 */
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role, companyName, email, phone } = req.body

    if (!username || !password || !role) {
      return res.status(400).json(validationErrorResponse('Missing required fields'))
    }

    const existingUser = await authService.getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json(validationErrorResponse('Username already exists'))
    }

    const hashedPassword = await hashPassword(password)

    const user = await authService.createUser({
      username,
      password: hashedPassword,
      role,
      companyName,
      email,
      phone,
    })

    res.json(successResponse(user, 'User registered successfully'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 用户登录
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json(validationErrorResponse('Missing username or password'))
    }

    const user = await authService.getUserByUsername(username)
    if (!user) {
      return res.status(401).json({ code: 401, message: 'Invalid credentials' })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: 'Invalid credentials' })
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      username: user.username,
    })

    res.json(successResponse(
      {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          companyName: user.company_name,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
      'Login successful'
    ))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取当前用户信息
 */
router.get('/user', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.user?.userId)
    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' })
    }

    res.json(successResponse({
      id: user.id,
      username: user.username,
      role: user.role,
      companyName: user.company_name,
      email: user.email,
      phone: user.phone,
    }))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 刷新Token
 */
router.post('/refresh', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const token = generateToken({
      userId: req.user?.userId,
      role: req.user?.role,
      username: req.user?.username,
    })

    res.json(successResponse({ token }, 'Token refreshed successfully'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

export default router
