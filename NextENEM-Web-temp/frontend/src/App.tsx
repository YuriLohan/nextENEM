import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Questions from './pages/Questions'
import Performance from './pages/Performance'
import Contents from './pages/Contents'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/conteudos" element={<Contents />} />
      <Route path="/home" element={
        <PrivateRoute><Home /></PrivateRoute>
      } />
      <Route path="/questions" element={
        <PrivateRoute><Questions /></PrivateRoute>
      } />
      <Route path="/performance" element={
        <PrivateRoute><Performance /></PrivateRoute>
      } />
    </Routes>
  )
}
