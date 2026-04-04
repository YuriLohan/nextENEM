import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Questions from './pages/Questions'
import Verified from './pages/Verified'
import Inbox from './pages/Inbox'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verified" element={<Verified />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/questions" element={
        <PrivateRoute>
          <Questions />
        </PrivateRoute>
      } />
    </Routes>
  )
}
