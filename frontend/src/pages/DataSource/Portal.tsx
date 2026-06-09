import React from 'react'
import { Tabs } from 'antd'
import DataUpload from './DataUpload'
import AuthorizationApproval from './AuthorizationApproval'
import DataQualityMonitoring from './DataQualityMonitoring'

const DataSourcePortal: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('upload')

  const items = [
    {
      key: 'upload',
      label: '数据加密上链',
      children: <DataUpload />,
    },
    {
      key: 'approval',
      label: '授权审批',
      children: <AuthorizationApproval />,
    },
    {
      key: 'monitoring',
      label: '数据质量监控',
      children: <DataQualityMonitoring />,
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default DataSourcePortal
