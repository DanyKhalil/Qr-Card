import { userApi } from '../../services/userApi.js';
import { useState } from 'react'
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import CoverPhoto from '../Profile/Cover Photo/CoverPhoto.jsx'
import ProfilePhotoAndHeadline from './Profile Photo with Headline/ProfilePhotoAndHeadline.jsx'
import TwoColumnLayout from './Two Column Layout/TwoColumnLayout.jsx'
import { useNavigate } from 'react-router-dom';


const EditUserProfile = ({
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

  const navigate = useNavigate();

  // here ill put  the inputs properties, and case they are not euqal the above anymore, ill sedn
  // a update request to the backend logic
  const [coverPhotoInput, setCoverPhotoInput] = useState(coverPhoto);
  const [profilePicInput, setProfilePicInput] = useState(profilePic);
  const [userNameInput, setUserNameInput] = useState(userName);
  const [dobInput, setDobInput] = useState(dob);
  const [headlineInput, setHeadlineInput] = useState(headline);
  const [phoneNumberInput, setPhoneNumberInput] = useState(contactLinks[1].name);
  const [connectLinksInput, setConnectLinksInput] = useState(connectLinks);
  const [websiteLinkInput, setWebsiteLinkInput] = useState(websiteLink);
  const [bioInput, setBioInput] = useState(bio);
  const [videosInput, setVideosInput] = useState(videos);
  const [locationsInput, setLocationsInput] = useState(locations);

  let personalInformationFields = [
    {label:"Name", id: "name", value: userNameInput, setter: setUserNameInput},
    {label:"Date of Birth", id: "dob", value: dobInput, setter: setDobInput},
    {label:"Phone No.", id: "phone_number", value: phoneNumberInput, setter: setPhoneNumberInput}
  ];





  // function to update user in db
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const handleUserProfileUpdate = async (newHeadline) => {

    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const result = await userApi.updateUserProfile(id, {headline: newHeadline});
      
      if (result.success) {
        setUpdateMessage('User updated successfully!');
        setTimeout(() => {setUpdateMessage(''); navigate(`/profile/${id}`);}, 2000);
        
      }
    } catch (error) {
      console.error('Failed to update userprofile:', error);
      setUpdateMessage(`Error: ${error.message}`);
      setTimeout(() => setUpdateMessage(''), 5000);
    } finally {
      setIsUpdating(false);
    }
  };


  const handleSaveChanges = () => {
    handleUserProfileUpdate(headlineInput);
  };


  return (    
    <div>
      <Header/>
      <CoverPhoto photo={coverPhotoInput} height={300} paddingTop={80}/>
      <ProfilePhotoAndHeadline  photo={profilePicInput} saveAction={handleSaveChanges}/>
      {updateMessage && (
        <div style={{
          position: "fixed",
          right: "10px",
          top: "100px",
          display: "inline",
          borderRadius: '4px',
          backgroundColor: updateMessage.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: updateMessage.includes('Error') ? '#c62828' : '#2e7d32',
          border: `1px solid ${updateMessage.includes('Error') ? '#ffcdd2' : '#c8e6c9'}`
        }}>
          {updateMessage}
        </div>
      )}
      <TwoColumnLayout 
              separatorWidth="3px"
              separatorColor="#82C294"
              gap="10px"
              className="my-layout"
              personalInformationFields = {personalInformationFields}
              headline={headlineInput} headlineSetter = {setHeadlineInput}
              connectLinks = {connectLinksInput} connectLinksSetter = {setConnectLinksInput}
              websiteLink = {websiteLinkInput} websiteLinkSetter = {setWebsiteLinkInput}
              bio = {bioInput} bioSetter = {setBioInput}
              videos = {videosInput} videosSetter = {setVideosInput}
              locations = {locationsInput} locationSetter={setLocationsInput}
              id = {id}
      >
      </TwoColumnLayout>
      <Footer />
    </div>
  )
}

export default EditUserProfile
