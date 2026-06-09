# 绿信链系统 - 项目配置说明

## 前端配置

### 环境变量 (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

### 启动前端开发服务器
```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 上运行

---

## Node.js后端API配置

### 环境变量 (.env)
创建 `backend/.env` 文件：
```
NODE_ENV=development
PORT=3001
API_PREFIX=/api

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=green_credit_dao

REDIS_HOST=localhost
REDIS_PORT=6379

BC_RPC_URL=http://localhost:8545
JAVA_SERVICE_URL=http://localhost:8080

LOG_LEVEL=info
```

### 启动Node.js服务器
```bash
cd backend
npm install
npm run dev
```

API服务器将在 http://localhost:3001 上运行

---

## Java区块链交互层配置

### pom.xml 依赖
项目已配置以下关键依赖：
- Spring Boot 3.0.5
- FISCO BCOS Java SDK 3.2.0
- Paillier同态加密库
- ZoKrates零知识证明库

### 配置文件 (application.yml)
```yaml
blockchain:
  config-path: classpath:fisco_bcos_config.conf
  group-id: 1
```

### 启动Java服务
```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Java服务将在 http://localhost:8080 上运行

---

## 数据库设置

### PostgreSQL初始化
```bash
psql -U postgres -f database/schema.sql
psql -U postgres -d green_credit_dao -f database/init.sql
```

### 必需的表
- users: 用户表（企业、银行、监管、数据源）
- enterprises: 企业表
- rating_applications: 评级申请表
- authorizations: 数据授权表
- carbon_data: 碳数据表
- green_certificates: 绿色证书表
- credits: 积分表
- audit_logs: 审计日志表

---

## 系统架构

```
前端 (React)
   ↓
API网关 (Nginx/Express Gateway)
   ↓
Node.js API层 (Express + TypeScript)
   ↓
数据存储:
- PostgreSQL (业务数据)
- Redis (缓存)
- Blockchain (FISCO BCOS)
   ↓
Java区块链交互层 (Spring Boot)
   ↓
智能合约交互
隐私计算 (Paillier + ZKP)
```

---

## API 端点

### 认证API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户
- `POST /api/auth/refresh` - 刷新Token

### 企业API
- `POST /api/enterprise/register` - 企业身份注册
- `GET /api/enterprise/:id` - 获取企业信息
- `POST /api/enterprise/rating/apply` - 提交评级申请
- `POST /api/enterprise/authorize` - 授权数据源
- `GET /api/enterprise/certificate/:id` - 获取绿色证书

### 区块链API
- `POST /api/blockchain/submitRating` - 提交评级到链
- `POST /api/blockchain/generateZKProof` - 生成零知识证明
- `POST /api/blockchain/verifyZKProof` - 验证零知识证明
- `POST /api/blockchain/encryptAndUpload` - 数据加密上链

---

## 开发指南

### 添加新的企业API端点
1. 在 `backend/src/routes/enterprise.ts` 中添加路由
2. 在 `backend/src/services/enterpriseService.ts` 中实现业务逻辑
3. 在 `backend/src/routes/enterprise.ts` 中添加类型定义

### 添加新的前端页面
1. 在 `frontend/src/pages/` 中创建新的页面组件
2. 在 `frontend/src/api/` 中创建API调用函数
3. 在 `frontend/src/App.tsx` 中添加路由配置

### 集成新的智能合约
1. 在 `backend/src/main/java/com/greencredit/blockchain/contract/` 中创建合约类
2. 在 `BlockchainService` 中实现合约调用方法
3. 在 `BlockchainController` 中暴露对应的REST接口

---

## 生产部署

### 前端构建
```bash
npm run build
# dist 目录包含生产构建
```

### 后端构建
```bash
npm run build
# dist 目录包含JavaScript编译文件
```

### Docker部署
参考 Dockerfile（需要创建）

### 配置检查清单
- [ ] 更改 JWT_SECRET
- [ ] 配置生产数据库
- [ ] 启用HTTPS
- [ ] 配置防火墙规则
- [ ] 设置日志聚合
- [ ] 配置备份策略

---

## 故障排查

### 连接数据库失败
- 检查PostgreSQL服务是否运行
- 检查连接字符串和凭证

### 与区块链连接失败
- 检查FISCO BCOS节点是否运行
- 检查网络连接和RPC URL

### 智能合约部署失败
- 检查编译是否成功
- 检查账户是否有足够的权限
- 查看区块链日志

---

## 安全建议

1. 不要在版本控制中提交敏感信息（密钥、密码）
2. 使用HTTPS进行所有通信
3. 实现速率限制和DDoS防护
4. 定期更新依赖包
5. 实现审计日志记录
6. 定期进行安全审计

