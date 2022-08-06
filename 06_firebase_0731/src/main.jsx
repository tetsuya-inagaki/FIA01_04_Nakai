import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/index.css'
import Top from './components/Top'
import ChatRoom from './components/ChatRoom'


ReactDOM.createRoot(
  document.getElementById('root')
)
.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="chat-room" element={<ChatRoom />} />
    </Routes>
  </BrowserRouter>
)
