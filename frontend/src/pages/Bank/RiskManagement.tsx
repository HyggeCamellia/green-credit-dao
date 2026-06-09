import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'

const RiskManagement: React.FC = () => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="绿色信贷投放"
              value={5200}
              suffix="万元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均利率"
              value={4.5}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="违约率"
              value={0.8}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="减排效果"
              value={2580}
              suffix="吨CO₂"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="绿色等级分布">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>绿色等级分布图表</p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="贷款违约情况">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>贷款违约趋势图表</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RiskManagement
