import React from 'react'
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd'
import { getAuthorizationRecords, authorizeDataSource } from '@/api/enterprise'
import { useAuthStore } from '@/store/authStore'

const DataAuthorization: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const user = useAuthStore((s) => s.user)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAuthorizationRecords(user?.id || '')
      if (res.code === 0 && res.data) {
        const pageData = res.data as any
        setData(pageData.list || pageData || [])
      }
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (user?.id) fetchData()
  }, [user])

  const handleRevoke = (_id: string) => {
    Modal.confirm({
      title: '撤销授权',
      content: '确定要撤销此授权吗？',
      onOk() {
        message.success('授权已撤销')
        fetchData()
      },
    })
  }

  const onFinish = async (values: any) => {
    setSubmitting(true)
    try {
      const res = await authorizeDataSource(
        user?.id || '',
        values.dataSourceId,
        values.dataType,
        values.expiryDate?.format('YYYY-MM-DD')
      )
      if (res.code === 0) {
        message.success('数据授权成功')
        setIsModalOpen(false)
        form.resetFields()
        fetchData()
      } else {
        message.error(res.message || '授权失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '授权失败')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { title: '数据源', dataIndex: 'data_source_name', key: 'dataSourceName' },
    { title: '数据类型', dataIndex: 'data_type', key: 'dataType' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const m: Record<string, string> = { pending: '待处理', authorized: '已授权', revoked: '已撤销' }
        return m[status] || status
      },
    },
    { title: '创建时间', dataIndex: 'created_date', key: 'createdDate' },
    { title: '过期时间', dataIndex: 'expiry_date', key: 'expiryDate' },
    {
      title: '操作', key: 'action',
      render: (_: any, record: any) => (
        <Button danger size="small" onClick={() => handleRevoke(record.id)}>撤销</Button>
      ),
    },
  ]

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        新增授权
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title="数据授权"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="dataSourceId" label="数据源" rules={[{ required: true, message: '请选择数据源' }]}>
            <Input placeholder="选择数据源" />
          </Form.Item>
          <Form.Item name="dataType" label="数据类型" rules={[{ required: true, message: '请输入数据类型' }]}>
            <Input placeholder="如：用电量、碳排放等" />
          </Form.Item>
          <Form.Item name="expiryDate" label="过期时间" rules={[{ required: true, message: '请选择过期时间' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataAuthorization
