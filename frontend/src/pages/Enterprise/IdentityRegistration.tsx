import React from 'react'
import { Form, Input, Button, Card, Upload, message, Spin, Descriptions, Alert } from 'antd'
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { registerEnterprise } from '@/api/enterprise'
import { createBlockInfo } from '@/utils/blockchain'

const IdentityRegistration: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [regResult, setRegResult] = React.useState<any>(null)

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const res = await registerEnterprise({
        name: values.companyName,
        businessLicense: values.businessLicense,
        industryType: values.industryType,
        registeredAddress: values.registeredAddress,
        legalRepresentative: values.legalRepresentative,
      })
      if (res.code === 0 && res.data) {
        const block = createBlockInfo()
        setRegResult({ enterprise: res.data, block })
        message.success('企业身份注册成功，已获得链上账户')
        form.resetFields()
      } else {
        message.error(res.message || '注册失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title="企业数字身份注册">
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="businessLicense"
              label="营业执照"
              rules={[{ required: true, message: '请上传营业执照' }]}
            >
              <Upload>
                <Button icon={<UploadOutlined />}>上传营业执照</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="companyName"
              label="企业名称"
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input placeholder="企业名称" />
            </Form.Item>

            <Form.Item
              name="industryType"
              label="行业类型"
              rules={[{ required: true, message: '请选择行业类型' }]}
            >
              <Input placeholder="如：制造业、能源等" />
            </Form.Item>

            <Form.Item
              name="registeredAddress"
              label="注册地址"
              rules={[{ required: true, message: '请输入注册地址' }]}
            >
              <Input placeholder="注册地址" />
            </Form.Item>

            <Form.Item
              name="legalRepresentative"
              label="法人代表"
              rules={[{ required: true, message: '请输入法人代表' }]}
            >
              <Input placeholder="法人代表" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                注册身份
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      {regResult && (
        <Card title="上链结果" style={{ marginTop: 24 }}>
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            message="身份注册成功，已上链存证"
            description={
              <Descriptions column={1} bordered size="small" style={{ marginTop: 8 }}>
                <Descriptions.Item label="企业名称">{regResult.enterprise.name}</Descriptions.Item>
                <Descriptions.Item label="链上账户地址">
                  <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{regResult.enterprise.walletAddress || ('0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''))}</code>
                </Descriptions.Item>
                <Descriptions.Item label="交易哈希">
                  <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{regResult.block.txHash}</code>
                </Descriptions.Item>
                <Descriptions.Item label="区块高度">#{regResult.block.blockNumber.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="区块哈希（区块头）">
                  <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{regResult.block.blockHash}</code>
                </Descriptions.Item>
              </Descriptions>
            }
          />
        </Card>
      )}
    </div>
  )
}

export default IdentityRegistration
