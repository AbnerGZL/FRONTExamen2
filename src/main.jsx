import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './login.jsx'
import Register from './register.jsx'
import Dashboard from './dashboard.jsx'
import OrganicerForm from './edit-organicer.jsx'
import EventForm from './edit-event.jsx'
import OrganicerAdd from './create-organicer.jsx'
import EventoAdd from './create-event.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organicer/edit/:id" element={<OrganicerForm />} />
        <Route path="/event/edit/:id" element={<EventForm />} />
        <Route path="/organicer/add" element={<OrganicerAdd />} />
        <Route path="/evento/add" element={<EventoAdd />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
