import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import CoverPhoto from './Cover Photo/CoverPhoto.jsx'
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
  id = "User001",
}
) => {
  return (    
    <div>
      <Header activeIndex={2}/>
      <CoverPhoto photo={coverPhoto} height={300} paddingTop={80}/>
      <ProfilePhotoAndHeadline  photo={profilePic} 
                                name={userName}
                                dob={dob}
                                headline={headline}
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
      >
      </TwoColumnLayout>
      <Footer />
    </div>
  )
}

export default UserProfile
