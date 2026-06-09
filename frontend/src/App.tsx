import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import Login from './pages/Login'
import EnterprisePortal from './pages/Enterprise/Portal'
import BankPortal from './pages/Bank/Portal'
import RegulatoryPortal from './pages/Regulatory/Portal'
import DataSourcePortal from './pages/DataSource/Portal'
import { useAuthStore } from './store/authStore'

const App: React.FC = () => {
  const { user } = useAuthStore()

  if (!user) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
          <Route path="/enterprise/*" element={<EnterprisePortal />} />
          <Route path="/bank/*" element={<BankPortal />} />
          <Route path="/regulatory/*" element={<RegulatoryPortal />} />
          <Route path="/datasource/*" element={<DataSourcePortal />} />
          <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
        </Routes>
    </Layout>
  )
}

export default App
