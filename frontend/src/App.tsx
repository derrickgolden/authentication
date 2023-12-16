import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ForgotPassword, Login, ResetPassword, Signup } from './user/components/auth'
import { LandingPage } from './user/pages'
import UserDashboard from './user/pages/UserDashboard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/reset-password/:urltoken" element={<ResetPassword />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />

        <Route path='/user/dashboard' element={<UserDashboard />} />

        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App
