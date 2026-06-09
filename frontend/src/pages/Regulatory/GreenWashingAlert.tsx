import React from 'react'
import { Table, Card, Row, Col, Statistic, Tag, Button, Space, Drawer, Descriptions, Modal, message, Spin } from 'antd'
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getGreenWashingAlerts, investigateEnterprise, revokeRating, GreenWashAlert } from '@/api/regulatory'

const GreenWashingAlertPage: React.FC = () => {
  const [data, setData] = React.useState<GreenWashAlert[]>([])
  const [loading, setLoading] = React.useState(false)
  const [investigateOpen, setInvestigateOpen] = React.useState(false)
  const [investigating, setInvestigating] = React.useState(false)
  const [investigateData, setInvestigateData] = React.useState<any>(null)
  const [revoking, setRevoking] = React.useState(false)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await getGreenWashingAlerts()
      if (res.data) {
        setData(res.data as GreenWashAlert[])
      }
    } catch {
      message.warning('获取预警列表失败，使用模拟数据')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAlerts()

    if (data.length === 0) {
      setData([
        {
          id: 1,
          enterpriseName: '虚假绿色能源有限公司',
          reportedRating: 'AAA',
          actualRating: 'A',
          discrepancy: 35,
          status: 'alert',
          alertDate: '2024-01-15',
          severity: 'high',
        },
        {
          id: 2,
          enterpriseName: '半真绿色工业集团',
          reportedRating: 'AA',
          actualRating: 'A',
          discrepancy: 15,
          status: 'warning',
          alertDate: '2024-01-14',
          severity: 'medium',
        },
      ])
    }
  }, [])

  const handleInvestigate = async (record: GreenWashAlert) => {
    setInvestigating(true)
    setInvestigateOpen(true)
    try {
      const res = await investigateEnterprise(record.enterpriseName)
      setInvestigateData(res.data)
    } catch {
      setInvestigateData({
        enterprise: {
          name: record.enterpriseName,
          rating: record.reportedRating,
          rating_score: 70,
        },
        carbonData: [
          { data_type: '碳排放量', value: 1500, unit: 'tCO₂', source_name: '电网数据' },
          { data_type: '能耗', value: 5000, unit: 'MWh', source_name: '环保数据' },
        ],
      })
    } finally {
      setInvestigating(false)
    }
  }

  const handleRevoke = (record: GreenWashAlert) => {
    Modal.confirm({
      title: '确认撤销评级',
      icon: <ExclamationCircleOutlined />,
      content: `确定要撤销「${record.enterpriseName}」的绿色评级吗？此操作不可撤销。`,
      okText: '确认撤销',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setRevoking(true)
        try {
          await revokeRating(record.enterpriseName)
          message.success(`已成功撤销「${record.enterpriseName}」的绿色评级`)
          fetchAlerts()
        } catch {
          message.error('撤销失败，请重试')
        } finally {
          setRevoking(false)
        }
      },
    })
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    },
    {
      title: '自报等级',
      dataIndex: 'reportedRating',
      key: 'reportedRating',
    },
    {
      title: '实际等级',
      dataIndex: 'actualRating',
      key: 'actualRating',
    },
    {
      title: '偏差(%)',
      dataIndex: 'discrepancy',
      key: 'discrepancy',
      render: (val: number) => <Tag color="red">{val}%</Tag>,
    },
    {
      title: '预警等级',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colorMap: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' }
        return <Tag color={colorMap[severity]}>{severity}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: GreenWashAlert) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleInvestigate(record)}>
            调查
          </Button>
          <Button size="small" danger loading={revoking} onClick={() => handleRevoke(record)}>
            撤销等级
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="高风险企业"
              value={data.filter((d) => d.severity === 'high').length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="中风险企业"
              value={data.filter((d) => d.severity === 'medium').length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="本月新增预警" value={data.length} prefix={<WarningOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="漂绿预警列表">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
      </Card>

      <Drawer
        title="企业调查详情"
        placement="right"
        onClose={() => setInvestigateOpen(false)}
        open={investigateOpen}
        width={600}
      >
        {investigating ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>正在调查中...</p>
          </div>
        ) : investigateData ? (
          <div>
            <Descriptions title="企业信息" column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="企业名称">
                {investigateData.enterprise?.name}
              </Descriptions.Item>
              <Descriptions.Item label="当前评级">
                {investigateData.enterprise?.rating}
              </Descriptions.Item>
              <Descriptions.Item label="评级得分">
                {investigateData.enterprise?.rating_score}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="碳数据记录" column={1} bordered>
              {investigateData.carbonData?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label="数据类型">{item.data_type}</Descriptions.Item>
                  <Descriptions.Item label="数值">
                    {item.value} {item.unit}
                  </Descriptions.Item>
                  <Descriptions.Item label="数据来源">{item.source_name}</Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          </div>
        ) : (
          <p>暂无调查数据</p>
        )}
      </Drawer>
    </div>
  )
}

export default GreenWashingAlertPage
