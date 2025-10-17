import './App.css'

import Header from './components/Header/Header.jsx';
import CoverPhoto from './components/Profile/Cover Photo/CoverPhoto.jsx';
import ProfilePhotoAndHeadline from './components/Profile/Profile Photo with Headline/ProfilePhotoAndHeadline.jsx';
import TwoColumnLayout from './components/Profile/Two Column Layout/TwoColumnLayout.jsx';
import Footer from './components/Footer/Footer.jsx';
import UserProfile from './pages/UserProfile.jsx';

function App() {
  return (    
        <div className="App">
               <UserProfile />
        </div>
  )
}

export default App
