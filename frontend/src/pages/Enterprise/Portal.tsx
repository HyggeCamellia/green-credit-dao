import React, { useState } from 'react'
import { Tabs, Card, Row, Col, Statistic, Button } from 'antd'
import { FileTextOutlined, ShareAltOutlined, CheckCircleOutlined, GiftOutlined } from '@ant-design/icons'
import IdentityRegistration from './IdentityRegistration'
import DataAuthorization from './DataAuthorization'
import RatingApplication from './RatingApplication'
import CertificateView from './CertificateView'
import CreditsManagement from './CreditsManagement'

const EnterprisePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const items = [
    {
      key: 'dashboard',
      label: '仪表板',
      children: <EnterpriseDashboard onNavigate={setActiveTab} />,
    },
    {
      key: 'identity',
      label: '数字身份',
      children: <IdentityRegistration />,
    },
    {
      key: 'authorization',
      label: '数据授权',
      children: <DataAuthorization />,
    },
    {
      key: 'rating',
      label: '评级申请',
      children: <RatingApplication />,
    },
    {
      key: 'certificate',
      label: '绿色证书',
      children: <CertificateView />,
    },
    {
      key: 'credits',
      label: '积分管理',
      children: <CreditsManagement />,
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

interface EnterpriseDashboardProps {
  onNavigate: (key: string) => void
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ onNavigate }) => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="绿色等级"
              value="AAA"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="评级得分"
              value={95}
              suffix="分"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="积分余额"
              value={1250}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有效期"
              value="2025-12-31"
            />
          </Card>
        </Col>
      </Row>

      <Card title="快速操作">
        <Row gutter={16}>
          <Col span={6}>
            <Button type="primary" block icon={<FileTextOutlined />} onClick={() => onNavigate('rating')}>
              申请绿色评级
            </Button>
          </Col>
          <Col span={6}>
            <Button block icon={<ShareAltOutlined />} onClick={() => onNavigate('authorization')}>
              授权数据共享
            </Button>
          </Col>
          <Col span={6}>
            <Button block icon={<CheckCircleOutlined />} onClick={() => onNavigate('certificate')}>
              下载证书
            </Button>
          </Col>
          <Col span={6}>
            <Button block icon={<GiftOutlined />} onClick={() => onNavigate('credits')}>
              积分兑换
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default EnterprisePortal
