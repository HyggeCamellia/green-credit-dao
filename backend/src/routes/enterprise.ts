import { Router, Response } from 'express'
import { AuthRequest, authMiddleware } from '@/middleware/auth'
import { successResponse } from '@/utils/response'
import * as enterpriseService from '@/services/enterpriseService'
import * as blockchainService from '@/utils/blockchain'

const router: Router = Router()

/**
 * 企业数字身份注册
 */
router.post('/register', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, businessLicense, industryType, registeredAddress, legalRepresentative } = req.body

    // 调用Java服务生成钱包
    const walletResponse = await blockchainService.callBlockchainService('generateWallet', {})

    // 创建企业记录
    const enterprise = await enterpriseService.createEnterprise({
      name,
      businessLicense,
      industryType,
      registeredAddress,
      legalRepresentative,
      walletAddress: walletResponse.address,
    })

    res.json(successResponse(enterprise, 'Enterprise registered successfully'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取企业信息
 */
router.get('/:enterpriseId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const enterprise = await enterpriseService.getEnterprise(req.params.enterpriseId)
    if (!enterprise) {
      return res.status(404).json({ code: 404, message: 'Enterprise not found' })
    }

    res.json(successResponse(enterprise))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 提交绿色评级申请
 */
router.post('/rating/apply', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseId, bankId } = req.body

    // 创建评级申请
    const application = await enterpriseService.createRatingApplication({
      enterpriseId,
      bankId,
    })

    res.json(successResponse(application, 'Rating application submitted successfully'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取企业的评级申请列表
 */
router.get('/rating/applications', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    // TODO: 实现分页获取评级申请列表
    res.json(successResponse([], 'Rating applications retrieved'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 授权数据提供者
 */
router.post('/authorize', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { enterpriseId, dataSourceId, dataType, expiryDate } = req.body

    const authorization = await enterpriseService.createAuthorization({
      enterpriseId,
      dataSourceId,
      dataType,
      expiryDate,
      txHash: '',
    })

    res.json(successResponse(authorization, 'Authorization created successfully'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取授权记录
 */
router.get('/authorizations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const enterpriseId = req.user?.userId
    const authorizations = await enterpriseService.getAuthorizationRecords(enterpriseId)

    res.json(successResponse(authorizations, 'Authorizations retrieved'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取绿色证书
 */
router.get('/certificate/:enterpriseId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // TODO: 从数据库或缓存获取证书
    res.json(successResponse({
      id: 'CERT-001',
      enterpriseId: req.params.enterpriseId,
      rating: 'AAA',
      certificateHash: '0x1234567890abcdef',
    }, 'Certificate retrieved'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

/**
 * 获取企业积分
 */
router.get('/credits/:enterpriseId', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    // TODO: 从数据库获取积分
    res.json(successResponse({
      credits: 2500,
      redeemable: 1200,
    }, 'Credits retrieved'))
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

export default router
