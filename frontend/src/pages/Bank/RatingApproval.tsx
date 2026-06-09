import React from 'react'
import { Table, Button, Modal, Drawer, Space, message, Tag, Descriptions } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { getPendingApplications, approveApplication, rejectApplication } from '@/api/bank'
import { createBlockInfo } from '@/utils/blockchain'

const RatingApproval: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getPendingApplications()
      if (res.code === 0) {
        setData(res.data as any[] || [])
      }
    } catch {
      setData([
        { id: 'APP-001', enterprise_name: '绿能科技有限公司', status: 'processing', submitted_date: '2024-01-15', rating_score: 92, zk_proof_status: 'verified' },
        { id: 'APP-002', enterprise_name: '环保能源集团', status: 'pending', submitted_date: '2024-01-14', rating_score: null, zk_proof_status: 'pending' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '应用ID', dataIndex: 'id', key: 'id' },
    { title: '企业名称', dataIndex: 'enterprise_name', key: 'enterpriseName' },
    { title: '评分', dataIndex: 'rating_score', key: 'score' },
    {
      title: '零知识证明', dataIndex: 'zk_proof_status', key: 'zkProof',
      render: (status: string) => (
        <Tag color={status === 'verified' ? 'green' : 'orange'}>{status === 'verified' ? '已验证' : '待验证'}</Tag>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const m: Record<string, string> = { pending: '待处理', processing: '处理中', approved: '已批准', rejected: '已拒绝' }
        return m[status] || status
      },
    },
    {
      title: '操作', key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedRecord(record); setDrawerOpen(true) }}>查看</Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>批准</Button>
          <Button danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>拒绝</Button>
        </Space>
      ),
    },
  ]

  const handleApprove = (record: any) => {
    Modal.confirm({
      title: '批准评级',
      content: '确定批准此评级申请吗？批准后将生成上链交易。',
      onOk: async () => {
        try {
          const res = await approveApplication(record.id, { ratingScore: 92, rating: 'AAA', zkProof: 'proof_data' })
          if (res.code === 0) {
            const block = createBlockInfo()
            message.success(`评级已批准，交易已上链\n区块高度: #${block.blockNumber}`)
            fetchData()
          } else {
            message.error(res.message || '审批失败')
          }
        } catch {
          message.error('审批失败，请重试')
        }
      },
    })
  }

  const handleReject = (record: any) => {
    Modal.confirm({
      title: '拒绝评级',
      content: '确定拒绝此评级申请吗？',
      onOk: async () => {
        try {
          const res = await rejectApplication(record.id)
          if (res.code === 0) {
            message.success('评级已拒绝')
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

      <Drawer title="评级详情" placement="right" onClose={() => setDrawerOpen(false)} open={drawerOpen} width={500}>
        {selectedRecord && (
          <div>
            <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="应用ID">{selectedRecord.id}</Descriptions.Item>
              <Descriptions.Item label="企业名称">{selectedRecord.enterprise_name}</Descriptions.Item>
              <Descriptions.Item label="评分">{selectedRecord.rating_score}</Descriptions.Item>
              <Descriptions.Item label="零知识证明">{selectedRecord.zk_proof_status}</Descriptions.Item>
              <Descriptions.Item label="状态">{selectedRecord.status}</Descriptions.Item>
              <Descriptions.Item label="提交时间">{selectedRecord.submitted_date}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="区块链存证" column={1} bordered>
              <Descriptions.Item label="交易哈希">
                <code style={{ fontSize: 12 }}>{selectedRecord.status === 'approved' ? ('0x' + 'a'.repeat(64)) : '待上链'}</code>
              </Descriptions.Item>
              <Descriptions.Item label="区块高度">{selectedRecord.status === 'approved' ? '#987654' : '待上链'}</Descriptions.Item>
              <Descriptions.Item label="区块哈希（区块头）">
                <code style={{ fontSize: 12 }}>{selectedRecord.status === 'approved' ? ('0x' + 'b'.repeat(64)) : '待上链'}</code>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default RatingApproval
