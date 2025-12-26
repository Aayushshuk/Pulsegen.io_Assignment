import React from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App(){
  const { user } = useAuth()
  return (
    <div style={{maxWidth: 1000, margin: '24px auto', fontFamily: 'system-ui, sans-serif'}}>
      <h1>Video Upload • Sensitivity • Streaming</h1>
      {user ? <Dashboard/> : <Login/>}
    </div>
  )
}
