import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {BrowserRouter,Routes,Route,Navigate,Link} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboardpage'
import SingleTicket from './pages/SingleTicket'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <h1>YFI Tickets</h1>
    <Routes>
      <Route path="/register"element={<RegisterPage/>}/>
      <Route path="/login"element={<LoginPage/>}/>
      <Route path="/dashboard"element={<Dashboard/>}/>
      <Route path="/tickets/:id"element={<SingleTicket/>}/>
      
      

    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
