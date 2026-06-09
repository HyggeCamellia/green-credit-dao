import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Spin } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import '../styles/login.less'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login: setLogin } = useAuthStore()

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      const res = await login(values.username, values.password)
      if (res.code === 0 && res.data) {
        setLogin(res.data.user, res.data.token)
        message.success('登录成功')
        navigate(`/${res.data.user.role}`)
      } else {
        message.error(res.message)
      }
    } catch (error: any) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Spin spinning={loading}>
        <Card className="login-card">
          <h1 className="login-title">绿信链</h1>
          <p className="login-subtitle">企业绿色信用评价系统</p>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}

export default Login
