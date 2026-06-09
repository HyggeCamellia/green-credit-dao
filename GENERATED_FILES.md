# 绿信链系统 - 代码生成清单

本文档列出了为绿信链系统生成的所有代码文件和结构。

## 📁 前端 (React + TypeScript + Ant Design)

### 项目配置
- `frontend/package.json` - 项目依赖配置
- `frontend/tsconfig.json` - TypeScript 配置
- `frontend/vite.config.ts` - Vite 打包配置
- `frontend/index.html` - HTML 入口

### 核心代码
- `frontend/src/main.tsx` - React 应用入口
- `frontend/src/App.tsx` - 路由配置
- `frontend/src/types/index.ts` - TypeScript 类型定义

### API 调用层
- `frontend/src/api/client.ts` - Axios 客户端（含拦截器）
- `frontend/src/api/auth.ts` - 认证 API
- `frontend/src/api/enterprise.ts` - 企业 API

### 状态管理
- `frontend/src/store/authStore.ts` - Zustand 认证状态

### 页面组件

#### 登录页
- `frontend/src/pages/Login.tsx` - 统一登录页面

#### 企业端页面
- `frontend/src/pages/Enterprise/Portal.tsx` - 企业仪表板
- `frontend/src/pages/Enterprise/IdentityRegistration.tsx` - 数字身份注册
- `frontend/src/pages/Enterprise/DataAuthorization.tsx` - 数据授权管理
- `frontend/src/pages/Enterprise/RatingApplication.tsx` - 评级申请
- `frontend/src/pages/Enterprise/CertificateView.tsx` - 绿色证书查看（含二维码）
- `frontend/src/pages/Enterprise/CreditsManagement.tsx` - 积分管理

#### 银行端页面
- `frontend/src/pages/Bank/Portal.tsx` - 银行仪表板
- `frontend/src/pages/Bank/RatingApproval.tsx` - 评级审批
- `frontend/src/pages/Bank/CertificateVerification.tsx` - 证书核验
- `frontend/src/pages/Bank/PostLoanMonitoring.tsx` - 贷后监控
- `frontend/src/pages/Bank/RiskManagement.tsx` - 风险管理大盘

#### 监管端页面
- `frontend/src/pages/Regulatory/Portal.tsx` - 监管仪表板
- `frontend/src/pages/Regulatory/AuditTrail.tsx` - 穿透式审计
- `frontend/src/pages/Regulatory/GreenWashingAlert.tsx` - 漂绿预警
- `frontend/src/pages/Regulatory/StatisticalReport.tsx` - 统计报告

#### 数据源端页面
- `frontend/src/pages/DataSource/Portal.tsx` - 数据源仪表板
- `frontend/src/pages/DataSource/DataUpload.tsx` - 数据加密上链
- `frontend/src/pages/DataSource/AuthorizationApproval.tsx` - 授权审批
- `frontend/src/pages/DataSource/DataQualityMonitoring.tsx` - 数据质量监控

### 布局组件
- `frontend/src/layouts/Layout.tsx` - 应用布局

### 样式文件
- `frontend/src/styles/index.less` - 全局样式
- `frontend/src/styles/login.less` - 登录页样式

---

## 📁 后端 API (Node.js + Express + TypeScript)

### 项目配置
- `backend/package.json` - 项目依赖
- `backend/tsconfig.json` - TypeScript 配置
- `backend/.env.example` - 环境变量示例
- `backend/Dockerfile` - Docker 配置

### 配置层
- `backend/src/config/index.ts` - 主配置文件
- `backend/src/config/database.ts` - PostgreSQL 连接池
- `backend/src/config/redis.ts` - Redis 连接
- `backend/src/config/logger.ts` - Winston 日志配置

### 中间件层
- `backend/src/middleware/auth.ts` - JWT 认证和角色权限检查

### 工具函数
- `backend/src/utils/response.ts` - API 响应格式化
- `backend/src/utils/jwt.ts` - JWT Token 生成和验证
- `backend/src/utils/crypto.ts` - 密码加密和验证
- `backend/src/utils/blockchain.ts` - 区块链服务调用

### 业务服务层
- `backend/src/services/authService.ts` - 认证服务
- `backend/src/services/enterpriseService.ts` - 企业服务
- `backend/src/services/dataService.ts` - 数据服务

### 路由层

#### 认证路由
- `backend/src/routes/auth.ts`
  - `POST /api/auth/register` - 用户注册
  - `POST /api/auth/login` - 用户登录
  - `GET /api/auth/user` - 获取用户信息
  - `POST /api/auth/refresh` - 刷新 Token

#### 企业路由
- `backend/src/routes/enterprise.ts`
  - `POST /api/enterprise/register` - 企业身份注册
  - `GET /api/enterprise/:id` - 获取企业信息
  - `POST /api/enterprise/rating/apply` - 提交评级申请
  - `POST /api/enterprise/authorize` - 数据授权
  - `GET /api/enterprise/certificate/:id` - 获取绿色证书
  - `GET /api/enterprise/credits/:id` - 获取积分

#### 银行路由
- `backend/src/routes/bank.ts`
  - `GET /api/bank/pending-applications` - 获取待处理申请
  - `POST /api/bank/approve-application/:id` - 批准评级
  - `POST /api/bank/reject-application/:id` - 拒绝评级
  - `GET /api/bank/monitor-enterprise/:id` - 获取监控数据

#### 监管路由
- `backend/src/routes/regulatory.ts`
  - `POST /api/regulatory/audit-enterprise` - 穿透式审计
  - `GET /api/regulatory/green-washing-alerts` - 漂绿预警
  - `GET /api/regulatory/statistics-report` - 统计报告

#### 数据源路由
- `backend/src/routes/datasource.ts`
  - `POST /api/datasource/upload` - 数据上传
  - `GET /api/datasource/pending-authorizations` - 待处理授权
  - `POST /api/datasource/approve-authorization/:id` - 批准授权
  - `POST /api/datasource/reject-authorization/:id` - 拒绝授权
  - `GET /api/datasource/quality-monitor` - 数据质量监控

### 应用主文件
- `backend/src/app.ts` - Express 应用配置
- `backend/src/index.ts` - 服务器入口

---

## 📁 Java 区块链交互层 (Spring Boot + FISCO BCOS)

### 项目配置
- `backend/pom.xml` - Maven 依赖配置
- `backend/src/main/resources/application.yml` - Spring 配置
- `backend/Dockerfile.java` - Docker 配置

### 配置层
- `backend/src/main/java/com/greencredit/blockchain/config/BlockchainConfig.java` - FISCO BCOS SDK 配置

### 智能合约交互
- `backend/src/main/java/com/greencredit/blockchain/contract/GreenRatingContract.java` - 评级合约
  - 企业绿色评级结构
  - 提交评级
  - 获取链上评级
  - 存证数据哈希
  - 记录授权信息

### 隐私计算工具
- `backend/src/main/java/com/greencredit/blockchain/util/PaillierEncryption.java` - Paillier 同态加密
  - 加密/解密
  - 同态加法
  - 同态乘法
  
- `backend/src/main/java/com/greencredit/blockchain/util/ZeroKnowledgeProof.java` - 零知识证明
  - 证明生成
  - 证明验证
  - 评级证明
  - 数据完整性证明

### 业务服务
- `backend/src/main/java/com/greencredit/blockchain/service/BlockchainService.java`
  - 钱包生成
  - 评级提交
  - 评级查询
  - 证明生成与验证
  - 数据加密上链

### REST 控制器
- `backend/src/main/java/com/greencredit/blockchain/controller/BlockchainController.java`
  - `POST /api/blockchain/generateWallet` - 生成钱包
  - `POST /api/blockchain/submitRating` - 提交评级
  - `POST /api/blockchain/getRating` - 获取评级
  - `POST /api/blockchain/generateZKProof` - 生成证明
  - `POST /api/blockchain/verifyZKProof` - 验证证明
  - `POST /api/blockchain/encryptAndUpload` - 数据加密上链

### 应用入口
- `backend/src/main/java/com/greencredit/blockchain/GreenCreditBlockchainApplication.java` - Spring Boot 应用

---

## 📁 数据库

### Schema 定义
- `database/schema.sql` - PostgreSQL 数据库表定义
  - `users` - 用户表（企业、银行、监管、数据源）
  - `enterprises` - 企业表
  - `rating_applications` - 评级申请表
  - `authorizations` - 数据授权表
  - `carbon_data` - 碳排放数据表
  - `green_certificates` - 绿色证书表
  - `credits` - 积分表
  - `credit_transactions` - 积分交易表
  - `blockchain_events` - 链上事件日志
  - `audit_logs` - 审计日志

### 初始化数据
- `database/init.sql` - 初始化测试数据

---

## 📁 部署与配置

### Docker 编排
- `docker-compose.yml` - 完整栈 Docker 编排配置
  - PostgreSQL
  - Redis
  - Node.js API
  - Java 区块链服务
  - Nginx 反向代理

### 项目文档
- `README.md` - 项目主文档
- `SETUP.md` - 详细设置指南
- `GENERATED_FILES.md` - 本文件

---

## 🚀 快速启动步骤

### 1. 前端（React）
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### 2. Node.js API
```bash
cd backend
npm install
cp .env.example .env
npm run dev  # http://localhost:3001
```

### 3. Java 区块链服务
```bash
cd backend
mvn clean package
mvn spring-boot:run  # http://localhost:8080
```

### 4. 数据库
```bash
psql -U postgres -f database/schema.sql
```

### 5. Docker 一键启动（可选）
```bash
docker-compose up -d
```

---

## 📊 系统功能对照表

| 功能模块 | 企业端 | 银行端 | 监管端 | 数据源端 |
|---------|-------|-------|-------|---------|
| 身份认证 | ✅ | ✅ | ✅ | ✅ |
| 仪表板 | ✅ | ✅ | ✅ | ✅ |
| 身份注册 | ✅ | - | - | - |
| 数据授权 | ✅ | - | - | - |
| 评级申请 | ✅ | - | - | - |
| 证书查看 | ✅ | - | - | - |
| 积分管理 | ✅ | - | - | - |
| 审批评级 | - | ✅ | - | - |
| 证书验证 | - | ✅ | - | - |
| 贷后监控 | - | ✅ | - | - |
| 风险管理 | - | ✅ | - | - |
| 穿透审计 | - | - | ✅ | - |
| 漂绿预警 | - | - | ✅ | - |
| 统计报告 | - | - | ✅ | - |
| 数据上传 | - | - | - | ✅ |
| 授权审批 | - | - | - | ✅ |
| 质量监控 | - | - | - | ✅ |

---

## 🔐 安全特性

- ✅ JWT 身份认证
- ✅ 多角色权限控制
- ✅ Bcrypt 密码加密
- ✅ Paillier 同态加密
- ✅ 零知识证明
- ✅ 区块链存证
- ✅ HTTPS 支持（生产环境）
- ✅ 审计日志记录

---

## 📚 技术栈总结

| 层次 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design + Vite |
| API | Node.js + Express + TypeScript |
| 区块链 | Java + Spring Boot + FISCO BCOS SDK |
| 数据库 | PostgreSQL + Redis |
| 隐私计算 | Paillier + ZoKrates |
| 容器化 | Docker + Docker Compose |
| 代理 | Nginx |

---

## 📝 文件数量统计

- **前端文件**: 30+ 个
- **后端路由**: 5 个
- **后端服务**: 3 个
- **Java 类**: 8 个
- **数据库文件**: 2 个
- **配置文件**: 10+ 个
- **文档文件**: 3 个

**总计: 60+ 个文件**

---

## 🔧 后续开发步骤

1. [ ] 完善智能合约实现（Solidity/Vyper）
2. [ ] 部署 FISCO BCOS 节点
3. [ ] 集成实际的 Paillier 加密库
4. [ ] 集成 ZoKrates 零知识证明
5. [ ] 添加单元测试
6. [ ] 添加集成测试
7. [ ] 性能优化和压力测试
8. [ ] 安全审计
9. [ ] 生产部署

---

**生成日期**: 2024年1月
**版本**: 1.0.0
