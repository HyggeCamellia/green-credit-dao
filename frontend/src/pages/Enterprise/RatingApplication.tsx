import React from 'react'
import { Table, Button, Modal, Form, Input, Select, message } from 'antd'
import { getRatingApplications, submitRatingApplication } from '@/api/enterprise'
import { createBlockInfo } from '@/utils/blockchain'

const RatingApplicationComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getRatingApplications('', 1, 100)
      if (res.code === 0 && res.data) {
        const pageData = res.data as any
        setData(pageData.list || pageData || [])
      } else {
        setData([])
      }
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '应用ID', dataIndex: 'id', key: 'id' },
    { title: '银行', dataIndex: 'bank_name', key: 'bankName' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const m: Record<string, string> = { pending: '待处理', processing: '处理中', approved: '已批准', rejected: '已拒绝' }
        return m[status] || status
      },
    },
    { title: '评级得分', dataIndex: 'rating_score', key: 'ratingScore' },
    { title: '等级', dataIndex: 'rating', key: 'rating' },
    { title: '提交时间', dataIndex: 'submitted_date', key: 'submittedDate' },
    {
      title: '交易哈希', key: 'txHash', width: 140,
      render: (_: any, record: any) => {
        if (!record.tx_hash && record.status === 'pending') return '-'
        const hash = record.tx_hash || createBlockInfo().txHash
        return <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{hash.slice(0, 16)}...</code>
      },
    },
    {
      title: '区块高度', key: 'blockNumber', width: 100,
      render: (_: any, record: any) => {
        if (record.status === 'pending') return '-'
        const block = createBlockInfo()
        return `#${block.blockNumber}`
      },
    },
  ]

  const onFinish = async (values: any) => {
    setSubmitting(true)
    try {
      const res = await submitRatingApplication(values.enterpriseId || '3', values.bankId)
      if (res.code === 0) {
        message.success('评级申请已提交，交易已上链')
        setIsModalOpen(false)
        form.resetFields()
        fetchData()
      } else {
        message.error(res.message || '提交失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        新增申请
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title="申请绿色评级"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="bankId" label="选择银行" rules={[{ required: true, message: '请选择银行' }]}>
            <Select placeholder="选择合作银行" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea placeholder="额外说明信息" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RatingApplicationComponent
