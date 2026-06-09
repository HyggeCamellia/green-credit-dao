-- 创建数据库
CREATE DATABASE green_credit_dao ENCODING 'UTF8';

-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'enterprise', 'bank', 'regulatory', 'datasource'
    company_name VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 企业表
CREATE TABLE enterprises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_license VARCHAR(100),
    industry_type VARCHAR(100),
    registered_address VARCHAR(255),
    legal_representative VARCHAR(100),
    wallet_address VARCHAR(100) UNIQUE,
    rating VARCHAR(10), -- 'A', 'AA', 'AAA'
    rating_score INT,
    rating_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 评级申请表
CREATE TABLE rating_applications (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    bank_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'approved', 'rejected'
    rating_score INT,
    rating VARCHAR(10),
    zk_proof TEXT,
    tx_hash VARCHAR(100),
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
    FOREIGN KEY (bank_id) REFERENCES users(id)
);

-- 授权记录表
CREATE TABLE authorizations (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    data_source_id INT NOT NULL,
    data_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'authorized', 'revoked'
    expiry_date TIMESTAMP,
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
    FOREIGN KEY (data_source_id) REFERENCES users(id)
);

-- 碳数据表
CREATE TABLE carbon_data (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    data_source_id INT NOT NULL,
    data_type VARCHAR(100), -- '用电量', '碳排放', '水耗'等
    value DECIMAL(18, 2),
    unit VARCHAR(50),
    encrypted_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'encrypted', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
    FOREIGN KEY (data_source_id) REFERENCES users(id)
);

-- 绿色证书表
CREATE TABLE green_certificates (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    rating VARCHAR(10),
    certificate_hash VARCHAR(100),
    zk_proof TEXT,
    qr_code TEXT,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
);

-- 积分表
CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    total_credits INT DEFAULT 0,
    redeemable_credits INT DEFAULT 0,
    pending_verification INT DEFAULT 0,
    expired_credits INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
);

-- 积分交易记录表
CREATE TABLE credit_transactions (
    id SERIAL PRIMARY KEY,
    enterprise_id INT NOT NULL,
    credits_amount INT,
    transaction_type VARCHAR(50), -- 'earn', 'redeem'
    description VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
);

-- 链上事件日志表
CREATE TABLE blockchain_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100),
    enterprise_id INT,
    tx_hash VARCHAR(100) UNIQUE,
    block_number BIGINT,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id INT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_enterprises_wallet ON enterprises(wallet_address);
CREATE INDEX idx_rating_applications_enterprise ON rating_applications(enterprise_id);
CREATE INDEX idx_rating_applications_bank ON rating_applications(bank_id);
CREATE INDEX idx_rating_applications_status ON rating_applications(status);
CREATE INDEX idx_authorizations_enterprise ON authorizations(enterprise_id);
CREATE INDEX idx_authorizations_status ON authorizations(status);
CREATE INDEX idx_carbon_data_enterprise ON carbon_data(enterprise_id);
CREATE INDEX idx_carbon_data_timestamp ON carbon_data(timestamp);
CREATE INDEX idx_blockchain_events_tx_hash ON blockchain_events(tx_hash);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
