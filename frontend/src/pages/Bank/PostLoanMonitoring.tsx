import React from 'react'
import { Table, Card, Row, Col, Statistic, Button, Space, Tag, Drawer, Descriptions, Modal, message } from 'antd'
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const PostLoanMonitoring: React.FC = () => {
  const [data] = React.useState([
    {
      id: 1,
      loanId: 'LOAN-001',
      enterpriseName: '绿能科技有限公司',
      rating: 'AAA',
      loanAmount: 5000000,
      loanDate: '2023-12-01',
      latestCarbonData: 95,
      ratingTrend: '稳定',
      riskLevel: 'low',
    },
    {
      id: 2,
      loanId: 'LOAN-002',
      enterpriseName: '环保能源集团',
      rating: 'A',
      loanAmount: 3000000,
      loanDate: '2023-11-15',
      latestCarbonData: 65,
      ratingTrend: '下降',
      riskLevel: 'medium',
    },
  ])

  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedLoan, setSelectedLoan] = React.useState<any>(null)

  const handleDetail = (record: any) => {
    setSelectedLoan(record)
    setDetailOpen(true)
  }

  const handleAlert = (record: any) => {
    Modal.confirm({
      title: '发送风险预警',
      icon: <ExclamationCircleOutlined />,
      content: `确定向「${record.enterpriseName}」发送风险预警通知吗？`,
      okText: '确认发送',
      cancelText: '取消',
      onOk() {
        message.success(`已向「${record.enterpriseName}」发送风险预警`)
      },
    })
  }

  const columns = [
    {
      title: '贷款ID',
      dataIndex: 'loanId',
      key: 'loanId',
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    },
    {
      title: '当前等级',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: '贷款金额',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: '最新碳数据',
      dataIndex: 'latestCarbonData',
      key: 'latestCarbonData',
    },
    {
      title: '等级趋势',
      dataIndex: 'ratingTrend',
      key: 'ratingTrend',
      render: (trend: string) => (
        <Tag color={trend === '上升' ? 'green' : trend === '下降' ? 'red' : 'blue'}>
          {trend}
        </Tag>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colorMap: Record<string, string> = { 'low': 'green', 'medium': 'orange', 'high': 'red' }
        return <Tag color={colorMap[level]}>{level}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleDetail(record)}>详情</Button>
          <Button size="small" danger onClick={() => handleAlert(record)}>预警</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在贷企业"
              value={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总贷款金额"
              value={8000}
              suffix="万元"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="风险预警"
              value={1}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="等级下降"
              value={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="贷后监控清单">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Drawer
        title="贷款详情"
        placement="right"
        onClose={() => setDetailOpen(false)}
        open={detailOpen}
        width={500}
      >
        {selectedLoan && (
          <div>
            <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="贷款ID">{selectedLoan.loanId}</Descriptions.Item>
              <Descriptions.Item label="企业名称">{selectedLoan.enterpriseName}</Descriptions.Item>
              <Descriptions.Item label="当前等级">{selectedLoan.rating}</Descriptions.Item>
              <Descriptions.Item label="贷款金额">¥{selectedLoan.loanAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="放贷日期">{selectedLoan.loanDate}</Descriptions.Item>
              <Descriptions.Item label="最新碳数据">{selectedLoan.latestCarbonData}</Descriptions.Item>
              <Descriptions.Item label="等级趋势">{selectedLoan.ratingTrend}</Descriptions.Item>
              <Descriptions.Item label="风险等级">{selectedLoan.riskLevel}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="区块链存证" column={1} bordered>
              <Descriptions.Item label="交易哈希">
                <code style={{ fontSize: 12, wordBreak: 'break-all' }}>0x{((selectedLoan.id * 12345) % 1000000).toString(16).padStart(64, 'a')}</code>
              </Descriptions.Item>
              <Descriptions.Item label="区块高度">
                #{1200000 + selectedLoan.id * 50}
              </Descriptions.Item>
              <Descriptions.Item label="区块哈希（区块头）">
                <code style={{ fontSize: 12, wordBreak: 'break-all' }}>0x{(selectedLoan.id * 98765).toString(16).padStart(64, 'b')}</code>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default PostLoanMonitoring
