import React from 'react'
import { Card, Statistic, Button, List, Row, Col, message } from 'antd'
import { GiftOutlined } from '@ant-design/icons'
import { getCredits } from '@/api/enterprise'

const CreditsManagement: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [credits, setCredits] = React.useState({ total: 2500, redeemable: 1200, pendingVerification: 800, expired: 500 })

  React.useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    setLoading(true)
    try {
      const res = await getCredits('3')
      if (res.code === 0 && res.data) {
        const d = res.data as any
        setCredits({
          total: d.credits || 0,
          redeemable: d.redeemable || 0,
          pendingVerification: d.pendingVerification || 800,
          expired: d.expired || 500,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const redemptions = [
    { id: 1, type: '评级费用减免', credits: 100, date: '2024-01-15', status: '已使用' },
    { id: 2, type: '咨询服务费用', credits: 50, date: '2024-01-10', status: '已使用' },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总积分" value={credits.total} prefix={<GiftOutlined />} valueStyle={{ color: '#1890ff' }} loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="可兑换" value={credits.redeemable} prefix={<GiftOutlined />} valueStyle={{ color: '#52c41a' }} loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="待验证" value={credits.pendingVerification} prefix={<GiftOutlined />} valueStyle={{ color: '#faad14' }} loading={loading} /></Card></Col>
        <Col span={6}><Card><Statistic title="已过期" value={credits.expired} prefix={<GiftOutlined />} valueStyle={{ color: '#f5222d' }} loading={loading} /></Card></Col>
      </Row>

      <Card title="兑换" extra={<Button type="primary" onClick={() => message.info('积分兑换功能开发中')}>立即兑换</Button>} style={{ marginBottom: 24 }}>
        <List
          dataSource={[
            { id: 1, name: '评级费用减免', credits: 100 },
            { id: 2, name: '咨询服务费用', credits: 50 },
            { id: 3, name: '数据认证费用', credits: 75 },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.name} description={`需要 ${item.credits} 积分`} />
              <Button onClick={() => message.info(`正在兑换「${item.name}」，消耗 ${item.credits} 积分`)}>兑换</Button>
            </List.Item>
          )}
        />
      </Card>

      <Card title="兑换历史">
        <List dataSource={redemptions} renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.type} description={`${item.date} · ${item.credits} 积分 · ${item.status}`} />
          </List.Item>
        )} />
      </Card>
    </div>
  )
}

export default CreditsManagement
