import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ForgotPassword, Login, ResetPassword, Signup } from './user/components/auth'
import { LandingPage } from './user/pages'
import UserDashboard from './user/pages/UserDashboard'
import { ALogin } from './admin/components'
import LandingPageHeader from './user/sections/LandingPageHeader'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />

        <Route path='/user'>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="reset-password/:urltoken" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path='dashboard' element={<UserDashboard />} />
        </Route>
        <Route path='/admin'>
          <Route path="login" element={<ALogin />} />
        </Route>
        

        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App


