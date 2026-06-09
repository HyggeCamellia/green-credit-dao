import React from 'react'
import { Tabs } from 'antd'
import AuditTrail from './AuditTrail'
import GreenWashingAlert from './GreenWashingAlert'
import StatisticalReport from './StatisticalReport'

const RegulatoryPortal: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('audit')

  const items = [
    {
      key: 'audit',
      label: '穿透式审计',
      children: <AuditTrail />,
    },
    {
      key: 'alert',
      label: '漂绿预警',
      children: <GreenWashingAlert />,
    },
    {
      key: 'report',
      label: '统计报告',
      children: <StatisticalReport />,
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default RegulatoryPortal
