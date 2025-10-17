import Footer from '../components/Footer/Footer.jsx'
import Header from '../components/Header/Header.jsx'
import CoverPhoto from '../components/Profile/Cover Photo/CoverPhoto.jsx'
import ProfilePhotoAndHeadline from '../components/Profile/Profile Photo with Headline/ProfilePhotoAndHeadline.jsx'
import TwoColumnLayout from '../components/Profile/Two Column Layout/TwoColumnLayout.jsx'


function UserProfile() {
  return (    
        <div>
            <Header/>
            <CoverPhoto photo={null} height={300} paddingTop={80}/>
            <ProfilePhotoAndHeadline        photo={null} 
                                            name="John Doe"
                                            dob="1990-05-15"
                                            headline="Software Developer at Tech Corp"
            />
            <TwoColumnLayout 
                    separatorWidth="3px"
                    separatorColor="#82C294"
                    gap="10px"
                    className="my-layout"
            >
            </TwoColumnLayout>
            <Footer />
        </div>
  )
}

export default UserProfile
