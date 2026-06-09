import React from 'react'
import { Tabs } from 'antd'
import RatingApproval from './RatingApproval'
import CertificateVerification from './CertificateVerification'
import PostLoanMonitoring from './PostLoanMonitoring'
import RiskManagement from './RiskManagement'

const BankPortal: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('approval')

  const items = [
    {
      key: 'approval',
      label: '评级审批',
      children: <RatingApproval />,
    },
    {
      key: 'verification',
      label: '证书核验',
      children: <CertificateVerification />,
    },
    {
      key: 'monitoring',
      label: '贷后监控',
      children: <PostLoanMonitoring />,
    },
    {
      key: 'risk',
      label: '风险管理',
      children: <RiskManagement />,
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default BankPortal
