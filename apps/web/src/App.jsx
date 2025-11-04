import './App.css'
import { Routes, Route } from "react-router-dom";

import Header from './components/Header/Header.jsx';
import CoverPhoto from './components/Profile/Cover Photo/CoverPhoto.jsx';
import ProfilePhotoAndHeadline from './components/Profile/Profile Photo with Headline/ProfilePhotoAndHeadline.jsx';
import TwoColumnLayout from './components/Profile/Two Column Layout/TwoColumnLayout.jsx';
import Footer from './components/Footer/Footer.jsx';
import UserProfile from './pages/UserProfile.jsx';
import EditUserProfile from './pages/EditUserProfile.jsx';
import ScanQrCode from './pages/ScanQrCode.jsx';

function App() {
  return (    
    <Routes>
      <Route path="/profile/:id" element={<UserProfile/>}/>
      <Route path="/edit-profile/:id" element={<EditUserProfile/>}/>
      <Route path="/scan-qr-code" element={<ScanQrCode/>}/>
    </Routes>
  )
}

export default App
