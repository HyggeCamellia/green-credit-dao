import React from 'react'
import { Card, Input, Button, Drawer, Space, Table, message, Descriptions } from 'antd'
import { SearchOutlined } from '@ant-design/icons'


const AuditTrail: React.FC = () => {
  const [searchCompany, setSearchCompany] = React.useState('')
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null)

  const handleSearch = () => {
    if (!searchCompany) {
      message.warning('请输入企业名称')
      return
    }

    setSelectedCompany({
      name: searchCompany,
      history: [
        {
          date: '2024-01-15',
          rating: 'AAA',
          score: 95,
          dataSource: ['电网数据', '环保数据'],
          authorizations: ['电力公司', '环保部门'],
          dataHash: '0xabc123',
          txHash: '0x' + 'a'.repeat(64),
          blockNumber: 1048576,
          blockHash: '0x' + 'e'.repeat(64),
        },
        {
          date: '2024-01-10',
          rating: 'AA',
          score: 88,
          dataSource: ['电网数据'],
          authorizations: ['电力公司'],
          dataHash: '0xdef456',
          txHash: '0x' + 'b'.repeat(64),
          blockNumber: 1048570,
          blockHash: '0x' + 'f'.repeat(64),
        },
      ],
    })
    setDetailsOpen(true)
  }

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%' }}>
          <Input
            placeholder="输入企业名称"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </Card>

      <Drawer
        title="企业穿透式审计"
        placement="right"
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
        width={800}
      >
        {selectedCompany && (
          <div>
            <h3>{selectedCompany.name}</h3>
            <Table
              dataSource={selectedCompany.history}
              columns={[
                {
                  title: '审计时间',
                  dataIndex: 'date',
                  key: 'date',
                },
                {
                  title: '评级',
                  dataIndex: 'rating',
                  key: 'rating',
                },
                {
                  title: '得分',
                  dataIndex: 'score',
                  key: 'score',
                },
                {
                  title: '数据源',
                  dataIndex: 'dataSource',
                  key: 'dataSource',
                  render: (sources: string[]) => sources.join(', '),
                },
                {
                  title: '授权方',
                  dataIndex: 'authorizations',
                  key: 'authorizations',
                  render: (auths: string[]) => auths.join(', '),
                },
                {
                  title: '数据哈希',
                  dataIndex: 'dataHash',
                  key: 'dataHash',
                },
                {
                  title: '交易哈希',
                  dataIndex: 'txHash',
                  key: 'txHash',
                  width: 130,
                  render: (hash: string) => (
                    <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{hash.slice(0, 16)}...</code>
                  ),
                },
                {
                  title: '区块高度',
                  dataIndex: 'blockNumber',
                  key: 'blockNumber',
                  width: 90,
                  render: (num: number) => `#${num.toLocaleString()}`,
                },
              ]}
              pagination={false}
              expandable={{
                expandedRowRender: (record: any) => (
                  <Descriptions title="区块链存证详情" column={2} bordered size="small">
                    <Descriptions.Item label="区块哈希（区块头）">
                      <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{record.blockHash}</code>
                    </Descriptions.Item>
                    <Descriptions.Item label="交易哈希">
                      <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{record.txHash}</code>
                    </Descriptions.Item>
                    <Descriptions.Item label="区块高度">#{record.blockNumber.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="数据哈希">{record.dataHash}</Descriptions.Item>
                  </Descriptions>
                ),
              }}
            />
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default AuditTrail
