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
import ProfileListPage from './components/Profile/ProfileList/ProfileListPage.jsx';
import NotificationsPage from './components/Profile/Notifications/NotificationsPage.jsx';

// Subscription pages
import SubscribePage from './pages/SubscribePage.jsx';
import SubscriptionSuccess from './pages/SubscriptionSuccess.jsx';
import AdminPayments from './pages/AdminPayments.jsx';

function App() {
  return (    
    <Routes>
      {/* Existing routes */}
      <Route path="/profile" element={<UserProfile/>}/> 
      <Route path="/profile/:id" element={<UserProfile/>}/> 
      <Route path="/edit-profile" element={<EditUserProfile/>}/>
      <Route path="/edit-profile/:id" element={<EditUserProfile/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/registration" element={<RegistrationForm/>}/>
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/Filtering" element={<Filtering/>}></Route>
      <Route path="/" element={<WelcomePage/>}></Route>
      <Route path="/scan-qr-code" element={<ScanQrCode/>}/>
      <Route path="/profile-analytics" element={<ProfileAnalytics/>}/>
      <Route path="/notifications" element={<NotificationsPage/>}/>
      <Route path="/payments" element={<AdminPayments/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/admin/add-user" element={<AddUserPage/>}/>
      <Route path="/profile-list" element={<ProfileListPage />} />

      {/* Subscription routes */}
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />
    </Routes>
  )
}

export default App;
