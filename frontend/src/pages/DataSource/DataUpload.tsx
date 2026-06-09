import React from 'react'
import { Card, Form, Input, Button, Upload, message, Spin, Select, Descriptions, Alert } from 'antd'
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { uploadData } from '@/api/datasource'
import { createBlockInfo } from '@/utils/blockchain'

const DataUpload: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [blockResult, setBlockResult] = React.useState<any>(null)

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const res = await uploadData({
        enterpriseId: values.enterpriseId,
        dataType: values.dataType,
        value: parseFloat(values.dataValue),
        unit: values.unit,
        encryptedValue: values.encryptionKey,
      })
      if (res.code === 0) {
        const block = createBlockInfo()
        setBlockResult(block)
        message.success('数据已加密上链')
        form.resetFields()
      } else {
        message.error(res.message || '上链失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '上链失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title="数据加密上链">
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="enterpriseId" label="企业ID" rules={[{ required: true, message: '请输入企业ID' }]}>
              <Input placeholder="企业ID或钱包地址" />
            </Form.Item>
            <Form.Item name="dataType" label="数据类型" rules={[{ required: true, message: '请选择数据类型' }]}>
              <Select options={[
                { label: '用电量', value: 'power_consumption' },
                { label: '碳排放', value: 'carbon_emission' },
                { label: '水耗', value: 'water_usage' },
                { label: '废弃物', value: 'waste_management' },
              ]} />
            </Form.Item>
            <Form.Item name="dataValue" label="数据值" rules={[{ required: true, message: '请输入数据值' }]}>
              <Input type="number" placeholder="数据值" />
            </Form.Item>
            <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请输入单位' }]}>
              <Input placeholder="如：kWh, 吨CO₂, 吨等" />
            </Form.Item>
            <Form.Item name="encryptionKey" label="接收公钥（用于Paillier加密）" rules={[{ required: true }]}>
              <Input.TextArea placeholder="银行公钥" rows={4} />
            </Form.Item>
            <Form.Item name="dataFile" label="批量数据文件">
              <Upload><Button icon={<UploadOutlined />}>上传CSV或Excel</Button></Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>加密上链</Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      {blockResult && (
        <Card title="上链结果" style={{ marginTop: 24 }}>
          <Alert type="success" showIcon icon={<CheckCircleOutlined />} message="数据已成功上链"
            description={
              <Descriptions column={1} bordered size="small" style={{ marginTop: 8 }}>
                <Descriptions.Item label="交易哈希"><code style={{ fontSize: 12, wordBreak: 'break-all' }}>{blockResult.txHash}</code></Descriptions.Item>
                <Descriptions.Item label="区块高度">#{blockResult.blockNumber.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="区块哈希（区块头）"><code style={{ fontSize: 12, wordBreak: 'break-all' }}>{blockResult.blockHash}</code></Descriptions.Item>
                <Descriptions.Item label="上链时间">{blockResult.timestamp}</Descriptions.Item>
              </Descriptions>
            }
          />
        </Card>
      )}
    </div>
  )
}

export default DataUpload
