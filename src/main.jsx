import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './route/index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>

  
      <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>,
  </GoogleOAuthProvider>
)
