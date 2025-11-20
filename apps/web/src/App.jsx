import './App.css'
import { Routes, Route } from "react-router-dom";

import Header from './components/Header/Header.jsx';
import CoverPhoto from './components/Profile/Cover Photo/CoverPhoto.jsx';
import ProfilePhotoAndHeadline from './components/Profile/Profile Photo with Headline/ProfilePhotoAndHeadline.jsx';
import TwoColumnLayout from './components/Profile/Two Column Layout/TwoColumnLayout.jsx';
import Footer from './components/Footer/Footer.jsx';
import UserProfile from './pages/UserProfile.jsx';
import EditUserProfile from './pages/EditUserProfile.jsx';
import Login from './pages/Login.jsx';
import RegistrationForm from './pages/Registration.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Filtering from './pages/Filtering.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import ScanQrCode from './pages/ScanQrCode.jsx';
import ProfileAnalytics from './pages/ProfileAnalytics.jsx';
import Admin from './pages/AdminUsers.jsx';
import AddUserPage from './pages/AddUserPage.jsx';

function App() {
  return (    
    <Routes>
      <Route path="/profile" element={<UserProfile/>}/> {/* for a user own profile */}
      <Route path="/profile/:id" element={<UserProfile/>}/> {/* for another user profile */}
      <Route path="/edit-profile" element={<EditUserProfile/>}/>
      <Route path="/edit-profile/:id" element={<EditUserProfile/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/registration" element={<RegistrationForm/>}/>
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/Filtering" element={<Filtering/>}></Route>
      <Route path="/" element={<WelcomePage/>}></Route>
      <Route path="/scan-qr-code" element={<ScanQrCode/>}/>
      <Route path="/profile-analytics" element={<ProfileAnalytics/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/admin/add-user" element={<AddUserPage/>}/>
    </Routes>
  )
}

export default App
