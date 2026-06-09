import React from 'react'
import { Card, Input, Button, Result, Space, message, Descriptions } from 'antd'
import { ScanOutlined } from '@ant-design/icons'
import { createBlockInfo } from '@/utils/blockchain'

const CertificateVerification: React.FC = () => {
  const [qrCode, setQrCode] = React.useState('')
  const [verificationResult, setVerificationResult] = React.useState<any>(null)

  const handleVerify = () => {
    if (!qrCode) {
      message.warning('请输入证书哈希或二维码')
      return
    }

    const block = createBlockInfo()
    setVerificationResult({
      valid: true,
      enterpriseName: '绿能科技有限公司',
      rating: 'AAA',
      issuedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      certificateHash: qrCode,
      blockInfo: block,
    })
  }

  return (
    <div>
      <Card title="绿色证书核验" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="输入证书二维码或哈希值"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            size="large"
          />
          <Button
            type="primary"
            size="large"
            icon={<ScanOutlined />}
            onClick={handleVerify}
            block
          >
            验证证书
          </Button>
        </Space>
      </Card>

      {verificationResult && (
        <Card>
          {verificationResult.valid ? (
            <Result
              status="success"
              title="证书验证成功"
              subTitle={`企业：${verificationResult.enterpriseName}`}
              extra={[
                <div key="details" style={{ textAlign: 'left', marginTop: 24 }}>
                  <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
                    <Descriptions.Item label="企业名称">{verificationResult.enterpriseName}</Descriptions.Item>
                    <Descriptions.Item label="绿色等级">{verificationResult.rating}</Descriptions.Item>
                    <Descriptions.Item label="发证日期">{verificationResult.issuedDate}</Descriptions.Item>
                    <Descriptions.Item label="有效期">{verificationResult.expiryDate}</Descriptions.Item>
                    <Descriptions.Item label="证书哈希">
                      <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{verificationResult.certificateHash}</code>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions title="区块链存证" column={1} bordered>
                    <Descriptions.Item label="交易哈希">
                      <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{verificationResult.blockInfo.txHash}</code>
                    </Descriptions.Item>
                    <Descriptions.Item label="区块高度">
                      #{verificationResult.blockInfo.blockNumber.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="区块哈希（区块头）">
                      <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{verificationResult.blockInfo.blockHash}</code>
                    </Descriptions.Item>
                    <Descriptions.Item label="上链时间">{verificationResult.blockInfo.timestamp}</Descriptions.Item>
                  </Descriptions>
                </div>,
              ]}
            />
          ) : (
            <Result
              status="error"
              title="证书验证失败"
              subTitle="证书不存在或已过期"
            />
          )}
        </Card>
      )}
    </div>
  )
}

export default CertificateVerification
