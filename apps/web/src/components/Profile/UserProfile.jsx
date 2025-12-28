import { useEffect } from "react"; // <-- import useEffect
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import CoverPhoto from './Cover Photo/CoverPhoto.jsx'
import PopupComponent from './Popup/PopupComponent.jsx'
import ProfilePhotoAndHeadline from './Profile Photo with Headline/ProfilePhotoAndHeadline.jsx'
import TwoColumnLayout from './Two Column Layout/TwoColumnLayout.jsx'

const UserProfile = ({
  coverPhoto = null,
  profilePic = null,
  userName = "Dany El Khalil",
  dob = "2004-12-16",
  headline = "Software Developer at Technosoft",
  contactLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
  connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
  websiteLink = [{name:"www.dany.com", iconName:"web"}],
  bio = "The ticket said the payment form was crashing. I spent the morning tracing the bug through a maze of old code, finally finding the culprit—a race condition no one had anticipated. I wrote a fix, tested it, and watched the 'success' notifications roll in. It's just a small thing, but the whole system is held together by fixes like this. The ticket said the payment form was crashing. I spent the morning tracing the bug through a maze of old code, finally finding the culprit—a race condition no one had anticipated. I wrote a fix, tested it, and watched the 'success' notifications roll in. It's just a small thing, but the whole system is held together by fixes like this",
  videos = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/video3"
          ],
  locations = [],
  followers = [],
  following = [],
  id = "User001",
  profileId,
  customContent,
  fetchUserProfile,
  QrCodeColor="#fff",
  includeProfilePic,
  includeContact,
  includeSocialMedia,
  includeWebsite,
}
) => {

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    try {
      const currentUser = JSON.parse(userStr);

      // Only update profileId if the current user matches the profile being viewed
      if (currentUser?.id === id && profileId) {
        localStorage.setItem("profileId", profileId);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [profileId, id]);

  const getToken = () => {
        return localStorage.getItem("token");
    };

  const getCurrentUser = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      try {
          return JSON.parse(userStr);
      } catch (error) {
          console.error("Error parsing user data:", error);
          return null;
      }
  };

  let activeIndex = getCurrentUser()?.id === id ? 3 : null;

  return (    
    <div>
      <Header activeIndex={activeIndex}/>
      <CoverPhoto photo={coverPhoto} height={300} paddingTop={80}/>
      <ProfilePhotoAndHeadline  photo={profilePic} 
                                name={userName}
                                dob={dob}
                                headline={headline}
                                id={id}
                                followers={followers}
                                following={following}
                                fetchUserProfile={fetchUserProfile}
      />
      <TwoColumnLayout 
              separatorWidth="3px"
              separatorColor="#82C294"
              gap="10px"
              className="my-layout"
              contactLinks = {contactLinks}
              connectLinks = {connectLinks}
              websiteLink = {websiteLink}
              bio = {bio}
              userName = {userName}
              videos = {videos}
              locations = {locations}
              id = {id}
              customContent = {customContent}
              QrCodeColor={QrCodeColor}
              profilePic={profilePic}
              includeProfilePic ={includeProfilePic}
              includeContact={includeContact}
              includeSocialMedia={includeSocialMedia}
              includeWebsite={includeWebsite}
      >
      </TwoColumnLayout>
      {!getCurrentUser()?.id && (<PopupComponent />)}
      <Footer />
    </div>
  )
}

export default UserProfile
