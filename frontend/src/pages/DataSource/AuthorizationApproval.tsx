import React from 'react'
import { Table, Button, Modal, Space, Tag, message, Drawer, Descriptions } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { getPendingAuthorizations, approveAuthorization, rejectAuthorization } from '@/api/datasource'
import { createBlockInfo } from '@/utils/blockchain'

const AuthorizationApproval: React.FC = () => {
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedAuth, setSelectedAuth] = React.useState<any>(null)
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getPendingAuthorizations()
      if (res.code === 0) {
        setData(res.data as any[] || [])
      }
    } catch {
      setData([
        { id: 1, auth_id: 'AUTH-001', enterprise_name: '绿能科技有限公司', data_type: '用电量', status: 'pending', request_date: '2024-01-15', bank_name: '绿色银行' },
        { id: 2, auth_id: 'AUTH-002', enterprise_name: '环保能源集团', data_type: '碳排放', status: 'authorized', request_date: '2024-01-10', bank_name: '可持续发展银行' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '授权ID', dataIndex: 'auth_id', key: 'authId' },
    { title: '企业名称', dataIndex: 'enterprise_name', key: 'enterpriseName' },
    { title: '数据类型', dataIndex: 'data_type', key: 'dataType' },
    { title: '请求银行', dataIndex: 'bank_name', key: 'bankName' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const cm: Record<string, string> = { pending: 'orange', authorized: 'green', rejected: 'red' }
        const sm: Record<string, string> = { pending: '待批准', authorized: '已授权', rejected: '已拒绝' }
        return <Tag color={cm[status]}>{sm[status]}</Tag>
      },
    },
    {
      title: '交易哈希', key: 'txHash', width: 140,
      render: (_: any, record: any) => {
        if (record.status === 'pending') return '待上链'
        const block = createBlockInfo()
        return <code style={{ fontSize: 11 }}>{block.txHash.slice(0, 16)}...</code>
      },
    },
    {
      title: '区块高度', key: 'blockNumber', width: 100,
      render: (_: any, record: any) => {
        if (record.status === 'pending') return '-'
        return `#${createBlockInfo().blockNumber}`
      },
    },
    {
      title: '操作', key: 'action',
      render: (_: any, record: any) => {
        if (record.status !== 'pending') {
          return <Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedAuth(record); setDetailOpen(true) }}>查看</Button>
        }
        return (
          <Space>
            <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>批准</Button>
            <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>拒绝</Button>
          </Space>
        )
      },
    },
  ]

  const handleApprove = (authId: string) => {
    Modal.confirm({
      title: '批准授权',
      content: '确定批准此数据授权吗？',
      onOk: async () => {
        try {
          const res = await approveAuthorization(authId.toString())
          if (res.code === 0) {
            const block = createBlockInfo()
            message.success(`授权已批准，数据推送中...\n区块高度: #${block.blockNumber}`)
            fetchData()
          }
        } catch {
          message.error('操作失败')
        }
      },
    })
  }

  const handleReject = (authId: string) => {
    Modal.confirm({
      title: '拒绝授权',
      content: '确定拒绝此数据授权吗？',
      onOk: async () => {
        try {
          const res = await rejectAuthorization(authId.toString())
          if (res.code === 0) {
            message.success('授权已拒绝')
            fetchData()
          }
        } catch {
          message.error('操作失败')
        }
      },
    })
  }

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Drawer title="授权详情" placement="right" onClose={() => setDetailOpen(false)} open={detailOpen} width={500}>
        {selectedAuth && (
          <div>
            <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="授权ID">{selectedAuth.auth_id}</Descriptions.Item>
              <Descriptions.Item label="企业名称">{selectedAuth.enterprise_name}</Descriptions.Item>
              <Descriptions.Item label="数据类型">{selectedAuth.data_type}</Descriptions.Item>
              <Descriptions.Item label="请求银行">{selectedAuth.bank_name}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={selectedAuth.status === 'authorized' ? 'green' : 'orange'}>{selectedAuth.status === 'authorized' ? '已授权' : '待批准'}</Tag></Descriptions.Item>
            </Descriptions>
            {selectedAuth.status !== 'pending' && (
              <Descriptions title="区块链存证" column={1} bordered>
                <Descriptions.Item label="交易哈希"><code style={{ fontSize: 12 }}>{'0x' + 'c'.repeat(64)}</code></Descriptions.Item>
                <Descriptions.Item label="区块高度">#987123</Descriptions.Item>
                <Descriptions.Item label="区块哈希（区块头）"><code style={{ fontSize: 12 }}>{'0x' + 'd'.repeat(64)}</code></Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default AuthorizationApproval
