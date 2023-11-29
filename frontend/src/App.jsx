import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ForgotPassword, Login, ResetPassword, Signup } from './user/components/auth'
import { LandingPage } from './user/pages'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        
        <Route path="/user/login" element={<Login loginType = "user" />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/reset-password/:urltoken" element={<ResetPassword />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />

        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App
