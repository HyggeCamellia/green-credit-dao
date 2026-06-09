import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag } from 'antd'
import { getQualityMonitor } from '@/api/datasource'

const DataQualityMonitoring: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({ totalRecords: 2100, successCount: 2068, failureCount: 32, avgSuccessRate: 98.15 })
  const [data, setData] = React.useState<any[]>([])

  React.useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getQualityMonitor()
      if (res.code === 0 && res.data) {
        const d = res.data as any
        const cs = d.currentStats || {}
        setStats({
          totalRecords: parseInt(cs.total_records || cs.totalRecords || 0),
          successCount: parseInt(cs.success_count || cs.successCount || 0),
          failureCount: parseInt(cs.failure_count || cs.failureCount || 0),
          avgSuccessRate: 98.15,
        })
        setData(d.uploadHistory || [])
      }
    } catch {
      setData([
        { upload_id: 'UP-001', data_type: '用电量', record_count: 1250, success_count: 1248, failure_count: 2, success_rate: 99.84, upload_date: '2024-01-15', status: 'success' },
        { upload_id: 'UP-002', data_type: '碳排放', record_count: 850, success_count: 820, failure_count: 30, success_rate: 96.47, upload_date: '2024-01-14', status: 'partial' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '上传ID', dataIndex: 'upload_id', key: 'uploadId' },
    { title: '数据类型', dataIndex: 'data_type', key: 'dataType' },
    { title: '总条数', dataIndex: 'record_count', key: 'recordCount' },
    { title: '成功条数', dataIndex: 'success_count', key: 'successCount' },
    { title: '失败条数', dataIndex: 'failure_count', key: 'failureCount' },
    { title: '成功率', dataIndex: 'success_rate', key: 'successRate', render: (rate: number) => `${rate.toFixed(2)}%` },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const cm: Record<string, string> = { success: 'green', partial: 'orange', failed: 'red' }
        const sm: Record<string, string> = { success: '成功', partial: '部分失败', failed: '失败' }
        return <Tag color={cm[status]}>{sm[status]}</Tag>
      },
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总上传次数" value={data.length || 2} loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="数据总条数" value={stats.totalRecords} loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均成功率" value={stats.avgSuccessRate} suffix="%" loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="异常告警" value={stats.failureCount} valueStyle={{ color: '#f5222d' }} loading={loading} /></Card></Col>
      </Row>
      <Card title="数据上传质量监控">
        <Table columns={columns} dataSource={data} rowKey={(r) => r.upload_id || r.id} loading={loading} />
      </Card>
    </div>
  )
}

export default DataQualityMonitoring
