import './App.css'
import searchIcon from "../src/assets/images/logos/qr-card.png"

import Header from './components/Header/Header.jsx';
import ProfilePic from './components/Profile/Profile Pic/ProfilePic.jsx';

function App() {
  return (    
        <div className="App">
                <Header/>
                <div className="main-content">
                        <div style={{ padding: '100px 20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <ProfilePic photo={searchIcon} size={200} borderWidth={4} borderColor="#82C294"/>
                               
                        </div>
                </div>
        </div>
  )
}

export default App
