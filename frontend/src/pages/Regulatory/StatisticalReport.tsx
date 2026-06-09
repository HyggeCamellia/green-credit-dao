import React from 'react'
import { Card, Row, Col, Statistic, Select, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

const StatisticalReport: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('all')

  const handleDownload = () => {
    const industryLabel = selectedIndustry === 'all' ? '全行业' :
      ({ 'manufacturing': '制造业', 'energy': '能源行业', 'telecom': '电信行业' } as Record<string, string>)[selectedIndustry] || selectedIndustry
    message.success(`正在生成「${industryLabel}」统计报告，请稍候...`)
  }

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Select
          value={selectedIndustry}
          onChange={setSelectedIndustry}
          style={{ width: 200, marginRight: 16 }}
          options={[
            { label: '全行业', value: 'all' },
            { label: '制造业', value: 'manufacturing' },
            { label: '能源行业', value: 'energy' },
            { label: '电信行业', value: 'telecom' },
          ]}
        />
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
          下载报告
        </Button>
      </Card>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="绿色信贷投放总额"
              value={521000}
              suffix="万元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="企业总数"
              value={248}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评级得分"
              value={78.5}
              suffix="分"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预计减排量"
              value={128000}
              suffix="吨CO₂"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="按地区分布">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>地区分布图表</p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="按行业分布">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>行业分布图表</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StatisticalReport
