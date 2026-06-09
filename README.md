# 绿信链 - 企业绿色信用评价系统

**一个基于FISCO BCOS区块链和智能合约的企业绿色信用评价系统**

## 项目概述

绿信链系统为银行、监管机构和企业提供一个透明、可信的绿色评级和信用评价平台。系统通过以下创新技术实现：

- **区块链存证**：利用FISCO BCOS联盟链记录所有评级和数据
- **隐私计算**：使用Paillier同态加密进行密文计算，保护敏感数据
- **零知识证明**：证明企业满足绿色评级要求，无需披露具体数据
- **智能合约**：自动化评级流程和数据验证

## 核心功能

### 企业端
- ✅ 数字身份注册（获得链上钱包）
- ✅ 数据授权管理（授权电网/环保部门读取数据）
- ✅ 绿色评级申请（触发智能合约自动评分）
- ✅ 证书查看与下载（含二维码验证）
- ✅ 积分管理（数据贡献获得积分可兑换）

### 银行端
- ✅ 评级申请审批（查看合约评分结果）
- ✅ 绿色证书核验（二维码验证防伪）
- ✅ 贷后监控（同步企业最新碳数据预警）
- ✅ 风险管理大盘（统计分析报表）

### 监管端
- ✅ 穿透式审计（追溯企业评级依据）
- ✅ 漂绿预警（检测自报数据与权威数据偏差）
- ✅ 统计报告（生成可视化分析报告）

### 数据源端（电网/环保）
- ✅ 数据加密上链（Paillier加密后存证）
- ✅ 授权审批（确认企业授权后推送数据）
- ✅ 数据质量监控（上传成功率统计）

## 技术架构

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React 18 + TypeScript + Ant Design | 企业级UI，支持多角色门户 |
| API网关 | Nginx + Express Gateway | 统一入口、鉴权、限流 |
| 应用服务 | Node.js + Express + TypeScript | HTTP接口、业务逻辑、会话管理 |
| 区块链交互 | Java + Spring Boot + FISCO BCOS SDK | 合约调用、交易签名、事件监听 |
| 区块链底层 | FISCO BCOS 2.9+ | 联盟链，PBFT共识，国密支持 |
| 数据存储 | PostgreSQL + Redis | 业务数据 + 缓存 |
| 隐私计算 | Paillier + ZoKrates | 密文计算 + 零知识证明 |

## 项目结构

```
green-credit-dao/
├── frontend/                    # React 18 + TypeScript 前端
│   ├── src/
│   │   ├── api/                # API 调用函数
│   │   ├── pages/              # 页面组件（企业/银行/监管/数据源）
│   │   ├── store/              # Zustand 状态管理
│   │   ├── types/              # TypeScript 类型定义
│   │   └── styles/             # 样式文件
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/            # 配置（数据库、Redis等）
│   │   ├── middleware/        # 中间件（认证、日志）
│   │   ├── routes/            # API 路由
│   │   ├── services/          # 业务服务层
│   │   └── utils/             # 工具函数
│   ├── pom.xml               # Java Maven 配置（区块链服务）
│   ├── src/main/java/        # Java 区块链交互层
│   └── .env.example
│
├── database/                  # 数据库相关
│   ├── schema.sql            # PostgreSQL Schema
│   └── init.sql              # 初始化数据
│
└── docker-compose.yml        # Docker 编排配置
```

## 快速开始

### 前置要求
- Node.js 16+
- Java 11+
- PostgreSQL 12+
- Redis 6+

### 1. 启动前端
```bash
cd frontend
npm install
npm run dev
```
访问 http://localhost:3000

### 2. 启动 Node.js API
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
API 在 http://localhost:3001

### 3. 启动 Java 区块链服务
```bash
cd backend
mvn clean package
mvn spring-boot:run
```
服务在 http://localhost:8080

### 4. 初始化数据库
```bash
psql -U postgres -f database/schema.sql
```

## 核心 API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/user` - 获取用户信息

### 企业
- `POST /api/enterprise/register` - 企业身份注册
- `POST /api/enterprise/rating/apply` - 提交评级申请
- `POST /api/enterprise/authorize` - 数据授权

### 区块链
- `POST /api/blockchain/submitRating` - 提交评级到链
- `POST /api/blockchain/generateZKProof` - 生成零知识证明
- `POST /api/blockchain/encryptAndUpload` - 数据加密上链

详见 [SETUP.md](./SETUP.md)

## 安全特性

- JWT 身份认证
- Paillier 同态加密
- 零知识证明
- 区块链存证
- PBFT 共识算法

## 许可证

MIT

**最后更新**：2024年1月
