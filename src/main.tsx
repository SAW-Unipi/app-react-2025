import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListPage, TodoPage } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />}/>
        <Route path="/lists/:id" element={<TodoPage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
