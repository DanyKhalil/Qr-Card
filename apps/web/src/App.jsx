import './App.css'

import Header from './components/Header/Header.jsx';
import ProfilePic from './components/Profile/Profile Pic/ProfilePic.jsx';
import CoverPhoto from './components/Profile/Cover Photo/CoverPhoto.jsx';
import Headline from './components/Profile/Headline/Headline.jsx';


function App() {
  return (    
        <div className="App">
                <Header/>
                <CoverPhoto photo={null} height={300} paddingTop={80}/>
                <ProfilePic photo={null} size={200} borderWidth={4} borderColor="#82C294"/>
                <Headline 
                        name="John Doe"
                        dob="1990-05-15"
                        headline="Software Developer at Tech Corp"
                />
        </div>
  )
}

export default App
