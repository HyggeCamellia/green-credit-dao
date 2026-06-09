-- 绿信链系统 - 初始化数据
-- 此文件包含开发和测试数据

INSERT INTO users (username, password, role, company_name, email, phone) VALUES
('admin', '$2a$10$JHtc8YSMzEqXNtlNLvc.med4uKxsrssrPZJpmyvgnlipEHngBs1J.', 'regulatory', '金融监管局', 'admin@regulat.gov', '010-1234567'),
('bank01', '$2a$10$JHtc8YSMzEqXNtlNLvc.med4uKxsrssrPZJpmyvgnlipEHngBs1J.', 'bank', '绿色银行', 'contact@greenbank.cn', '010-2345678'),
('enterprise01', '$2a$10$JHtc8YSMzEqXNtlNLvc.med4uKxsrssrPZJpmyvgnlipEHngBs1J.', 'enterprise', '绿能科技有限公司', 'contact@greentech.cn', '010-3456789'),
('datasource01', '$2a$10$JHtc8YSMzEqXNtlNLvc.med4uKxsrssrPZJpmyvgnlipEHngBs1J.', 'datasource', '国家电网有限公司', 'data@sgcc.com.cn', '010-4567890');

INSERT INTO enterprises (name, business_license, industry_type, registered_address, legal_representative, wallet_address) VALUES
('绿能科技有限公司', 'BL20240001', '新能源', '北京市朝阳区', '张三', '0x1234567890abcdef'),
('环保能源集团', 'BL20240002', '环保能源', '上海市浦东新区', '李四', '0xabcdef1234567890');

-- 注意：密码应该使用bcrypt加密，示例使用$2a$10$...表示加密后的密码
