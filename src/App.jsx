import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastProvider from './components/ToastProvider'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ToastProvider />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
