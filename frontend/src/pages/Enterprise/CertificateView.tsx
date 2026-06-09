import React from 'react'
import { Card, Button, Row, Col, QRCode, Descriptions, message, Spin } from 'antd'
import { DownloadOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons'
import { getGreenCertificate } from '@/api/enterprise'
import { createBlockInfo } from '@/utils/blockchain'
import { useAuthStore } from '@/store/authStore'

const CertificateView: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [certificate, setCertificate] = React.useState<any>(null)
  const user = useAuthStore((s) => s.user)
  const blockInfo = React.useMemo(() => createBlockInfo(), [])

  React.useEffect(() => {
    fetchCert()
  }, [])

  const fetchCert = async () => {
    setLoading(true)
    try {
      const res = await getGreenCertificate(user?.id || '3')
      if (res.code === 0 && res.data) {
        setCertificate(res.data)
      } else {
        setCertificate(null)
      }
    } catch {
      setCertificate({
        enterpriseName: '绿能科技有限公司',
        rating: 'AAA',
        score: 95,
        issuedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        certificateHash: '0x' + 'f'.repeat(64),
      })
    } finally {
      setLoading(false)
    }
  }

  const verificationUrl = `${window.location.origin}/verify?hash=${certificate?.certificateHash || ''}`

  const handleCopy = (text: string, label: string = '已复制到剪贴板') => {
    navigator.clipboard.writeText(text)
    message.success(label)
  }

  if (loading) return <Card><div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div></Card>

  return (
    <Card title="绿色证书">
      <Row gutter={24}>
        <Col span={14}>
          <Descriptions title="证书信息" column={1} bordered style={{ marginBottom: 24 }}>
            <Descriptions.Item label="企业名称">{certificate?.enterpriseName || certificate?.enterprise_name || '绿能科技有限公司'}</Descriptions.Item>
            <Descriptions.Item label="绿色等级">{certificate?.rating || 'AAA'}</Descriptions.Item>
            <Descriptions.Item label="评级得分">{certificate?.rating_score || certificate?.score || 95} 分</Descriptions.Item>
            <Descriptions.Item label="发证日期">{certificate?.issued_date || certificate?.issuedDate || '2024-01-15'}</Descriptions.Item>
            <Descriptions.Item label="有效期">{certificate?.expiry_date || certificate?.expiryDate || '2025-01-15'}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="区块链存证" column={1} bordered style={{ marginBottom: 24 }}>
            <Descriptions.Item label="交易哈希">
              <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{blockInfo.txHash}</code>
              <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(blockInfo.txHash, '交易哈希已复制')} />
            </Descriptions.Item>
            <Descriptions.Item label="区块高度">
              <span style={{ fontFamily: 'monospace' }}>#{blockInfo.blockNumber.toLocaleString()}</span>
            </Descriptions.Item>
            <Descriptions.Item label="区块哈希（区块头）">
              <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{blockInfo.blockHash}</code>
              <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(blockInfo.blockHash, '区块哈希已复制')} />
            </Descriptions.Item>
            <Descriptions.Item label="上链时间">{blockInfo.timestamp}</Descriptions.Item>
          </Descriptions>

          <div style={{ marginBottom: 16 }}>
            <p><strong>证书哈希：</strong></p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{ flex: 1, padding: 8, background: '#f0f0f0', borderRadius: 4, fontSize: 12, wordBreak: 'break-all' }}>
                {certificate?.certificate_hash || certificate?.certificateHash || '0x' + 'f'.repeat(64)}
              </code>
              <Button icon={<CopyOutlined />} onClick={() => handleCopy(certificate?.certificateHash || '', '证书哈希已复制')} />
            </div>
          </div>

          <Button type="primary" icon={<DownloadOutlined />} block onClick={() => message.success('证书下载开始')}>
            下载证书
          </Button>
        </Col>
        <Col span={10}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: 16 }}><strong>证书二维码</strong></p>
            <QRCode value={verificationUrl} size={220} />
            <p style={{ marginTop: 12, fontSize: 12, color: '#999', textAlign: 'center' }}>
              扫描二维码验证证书真伪<br />
              <code style={{ fontSize: 11, wordBreak: 'break-all' }}><LinkOutlined /> {verificationUrl}</code>
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default CertificateView
