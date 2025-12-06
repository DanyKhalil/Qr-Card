import { userApi } from '../../services/userApi.js';
import { useState } from 'react'
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import CoverPhoto from '../Profile/Cover Photo/CoverPhoto.jsx'
import ProfilePhotoAndHeadline from './Profile Photo with Headline/ProfilePhotoAndHeadline.jsx'
import TwoColumnLayout from './Two Column Layout/TwoColumnLayout.jsx'
import { useNavigate } from 'react-router-dom';
import AddSocialMediaModal from './Modals/AddSocialMediaModal/AddSocialMediaModal.jsx';
import AddVideoModal from './Modals/VideoModals/AddVideoModal.jsx';
import EditVideoModal from './Modals/VideoModals/EditVideoModal.jsx';
import AddLocationModal from './Modals/LocationModals/AddLocationModal.jsx';
import EditLocationModal from './Modals/LocationModals/EditLocationModal.jsx';


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
  customContent,
  QrCodeColor,
}
) => {

  const navigate = useNavigate();

  // here ill put  the inputs properties, and case they are not euqal the above anymore, ill sedn
  // a update request to the backend logic
  const [coverPhotoInput, setCoverPhotoInput] = useState(coverPhoto);

  const [profilePicInput, setProfilePicInput] = useState(profilePic);

  const [qrCodeColorInput, setQrCodeColorInput] = useState(QrCodeColor)

  // USER NAME INPUTT
  const [userNameInput, setUserNameInput] = useState(userName);
  const [userNameInputErrorMessage, setUserNameInputErrorMessage] = useState('');
  const [userNameInputIsTouched, setUserNameInputIsTouched] = useState(false);
  const validateUserName = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '')
      return 'Name cannot be empty';
    if (trimmedValue.length < 2)
      return 'Name must be at least 2 characters long';
    if (trimmedValue.length > 50)
      return 'Name must be less than 50 characters';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue))
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };
  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUserNameInput(value);
    if (userNameInputIsTouched) {
      const error = validateUserName(value);
      setUserNameInputErrorMessage(error);
    }
  };
  const handleUserNameBlur = () => {
    setUserNameInputIsTouched(true);
    const error = validateUserName(userNameInput);
    setUserNameInputErrorMessage(error);
  };

  const [dobInput, setDobInput] = useState(dob);
  const [dobInputErrorMessage, setDobInputErrorMessage] = useState('');
  const [dobInputIsTouched, setDobInputIsTouched] = useState(false);
  const validateDob = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return '';
    }
    const dobDate = new Date(trimmedValue);
    if (isNaN(dobDate.getTime())) {
      return 'Please enter a valid date';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
      return 'Date of birth cannot be in the future';
    }
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 150);
    if (dobDate < minDate) {
      return 'Please enter a valid date of birth';
    }
    return '';
  };
  const handleDobChange = (e) => {
    const value = e.target.value;
    setDobInput(value);
    if (dobInputIsTouched) {
      const error = validateDob(value);
      setDobInputErrorMessage(error);
    }
  };
  const handleDobBlur = () => {
    setDobInputIsTouched(true);
    const error = validateDob(dobInput);
    setDobInputErrorMessage(error);
  };

  const [headlineInput, setHeadlineInput] = useState(headline);
  const [headlineInputErrorMessage, setHeadlineInputErrorMessage] = useState('');

  const [phoneNumberInput, setPhoneNumberInput] = useState(contactLinks[1].name[0]==null || contactLinks[1].name[0]=='' ? '' : contactLinks[1].name[0]);
  const [phoneNumberInputErrorMessage, setPhoneNumberInputErrorMessage] = useState('');
  const [phoneNumberInputIsTouched, setPhoneNumberInputIsTouched] = useState(false);
  const validatePhoneNumber = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return '';
    }
    const cleanValue = trimmedValue.replace(/[\s+\-]/g, '');
    if (!/^[\d\s+\-()]+$/.test(trimmedValue)) {
      return 'Phone number can only contain numbers, spaces, +, -, and parentheses';
    }
    if (cleanValue.length < 7) {
      return 'Phone number must have at least 7 digits';
    }
    if (cleanValue.length > 15) {
      return 'Phone number is too long';
    }
    return '';
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumberInput(value);
    if (phoneNumberInputIsTouched) {
      const error = validatePhoneNumber(value);
      setPhoneNumberInputErrorMessage(error);
    }
  };
  const handlePhoneNumberBlur = () => {
    setPhoneNumberInputIsTouched(true);
    const error = validatePhoneNumber(phoneNumberInput);
    setPhoneNumberInputErrorMessage(error);
  };

  const [connectLinksInput, setConnectLinksInput] = useState(connectLinks);

  const [websiteLinkInput, setWebsiteLinkInput] = useState(websiteLink);
  const [websiteLinkInputErrorMessage, setWebsiteLinkInputErrorMessage] = useState('');
  const [websiteLinkInputIsTouched, setWebsiteLinkInputIsTouched] = useState(false);
  const validateWebsiteLink = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return '';
    }
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
    if (!urlPattern.test(trimmedValue)) {
      return 'Please enter a valid website URL (e.g., example.com, www.example.com, https://example.com)';
    }
    return '';
  };
  const handleWebsiteLinkChange = (e) => {
    const value = e.target.value;
    setWebsiteLinkInput(value);
    if (websiteLinkInputIsTouched) {
      const error = validateWebsiteLink(value);
      setWebsiteLinkInputErrorMessage(error);
    }
  };
  const handleWebsiteLinkBlur = () => {
    setWebsiteLinkInputIsTouched(true);
    const error = validateWebsiteLink(websiteLinkInput);
    setWebsiteLinkInputErrorMessage(error);
  };

  const [bioInput, setBioInput] = useState(bio);
  const [bioInputErrorMessage, setBioInputErrorMessage] = useState('');

  const [videosInput, setVideosInput] = useState(videos);

  const [locationsInput, setLocationsInput] = useState(locations);

  const [customContentInput, setCustomContentInput] = useState(customContent || []);



  // states for modals to add or update things
  const [addSocialMediaModalIsVisible, setAddSocialMediaModalIsVisible] = useState(false);
  
  const [addVideoModalIsVisible, setAddVideoModalIsVisible] = useState(false);
  const [updateVideoModalIsVisible, setUpdateVideoModalIsVisible] = useState(false);

  const [addAdressModalIsVisible, setAddAdressModalIsVisible] = useState(false);
  const [updateAdressModalIsVisible, setUpdateAdressModalIsVisible] = useState(false);

  // updating Modal Objecst
  const [videoObjectUnderUpdate, setVideoObjectUnderUpdate] = useState({id:'', title:'', description:'', video_url:''})
  const [locationObjectUnderUpdate, setLocationObjectUnderUpdate] = useState({id:'', title:'', floor:'', building:'', street:'', city:'', state:'', country:'', maps_url:''})





  // Profile and Cover Photos UseStates:
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  
  const handleProfilePicChange = (file) => {
    if (file) {
      setProfilePicFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePicInput(previewUrl);
    }
  };

  const handleCoverPhotoChange = (file) => {
    if (file) {
      setCoverPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPhotoInput(previewUrl);
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePicFile(null);
    setProfilePicInput(null);
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhotoFile(null);
    setCoverPhotoInput(null);
  };






  let personalInformationFields = [
    {label:"Name", type: "text", id: "name", value: userNameInput, setter: setUserNameInput, onChange: handleUserNameChange , onBlur: handleUserNameBlur, errorMessage: userNameInputErrorMessage},
    {label:"Date of Birth", type: "date", id: "dob", value: dobInput, setter: setDobInput, onChange: handleDobChange, onBlur: handleDobBlur, errorMessage: dobInputErrorMessage},
    {label:"Phone No.", type: "text", id: "phone_number", value: phoneNumberInput, setter: setPhoneNumberInput, onChange: handlePhoneNumberChange, onBlur: handlePhoneNumberBlur, errorMessage: phoneNumberInputErrorMessage}
  ];




  // function to update user in db
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleUserProfileUpdate = async (newUserName, newDob, newPhoneNumber, newHeadline, newBio, newWebsite, newSocialMediaLinks, newVideos, newLocations, newCustomContent) => {
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const formData = new FormData();
      
      formData.append('userName', newUserName);
      
      let cleanDob = null;
      if (newDob && !(newDob=='') && !isNaN(new Date(newDob).getTime())) {
        // valid date → convert to YYYY-MM-DD
        cleanDob = new Date(newDob).toISOString().split("T")[0];
      }
      formData.append('dob', cleanDob);

      formData.append('phoneNumber', newPhoneNumber);
      formData.append('headline', newHeadline);
      formData.append('bio', newBio);
      formData.append('websiteUrl', newWebsite);
      formData.append('qrCodeColor', qrCodeColorInput);
      formData.append('connectLinks', JSON.stringify(newSocialMediaLinks));
      formData.append('videos', JSON.stringify(newVideos));
      formData.append('locations', JSON.stringify(newLocations));
      formData.append('customContent', JSON.stringify(newCustomContent))
      
      if (profilePicFile) {
        formData.append('profilePicture', profilePicFile);
      } else {
        formData.append('profilePhotoPath', profilePicInput || ''); // Ensure it's a string
      }
      
      if (coverPhotoFile) {
        formData.append('coverPhoto', coverPhotoFile);
      } else {
        formData.append('coverPhotoPath', coverPhotoInput || '');
      }

      // Send as FormData instead of JSON
      const result = await userApi.updateUserProfile(id, formData);
      
      if (result.success) {
        setProfilePicFile(null);
        setCoverPhotoFile(null);
        setUpdateMessage('User updated successfully!');
        setTimeout(() => {
          setUpdateMessage(''); 
          navigate(`/profile/${id}`);
        }, 1000);
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
    handleUserProfileUpdate(userNameInput, dobInput, phoneNumberInput, headlineInput, bioInput, websiteLinkInput, connectLinksInput, videosInput, locationsInput, customContentInput );
  };


  return (    
    <div>
      <Header activeIndex={2} />
      <CoverPhoto photo={coverPhotoInput} height={300} paddingTop={80}/>
      <ProfilePhotoAndHeadline
        photo={profilePicInput}
        saveAction={handleSaveChanges}

        onProfilePicChange={handleProfilePicChange}
        onCoverPhotoChange={handleCoverPhotoChange}
        onRemoveProfilePic={handleRemoveProfilePic}
        onRemoveCoverPhoto={handleRemoveCoverPhoto}

        disabledSave={userNameInputErrorMessage != '' 
                                    || dobInputErrorMessage != '' 
                                    || phoneNumberInputErrorMessage != '' 
                                    || websiteLinkInputErrorMessage != ''}
      />
      {updateMessage && (
        <div style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "fixed",
          right: "10px",
          top: "100px",
          display: "inline",
          borderRadius: '15px',
          padding: '20px',
          backgroundColor: updateMessage.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: updateMessage.includes('Error') ? '#c62828' : '#2e7d32',
          border: `1px solid ${updateMessage.includes('Error') ? '#ffcdd2' : '#c8e6c9'}`
        }}>
          {updateMessage}
        </div>
      )}
      {isUpdating && (
        <div style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "fixed",
          right: "10px",
          top: "100px",
          display: "inline",
          borderRadius: '15px',
          padding: '20px',
          backgroundColor: updateMessage.includes('Error') ? '#ffebee' : '#ebdf5fff',
          color: updateMessage.includes('Error') ? '#c62828' : '#000000ff',
          border: `1px solid ${updateMessage.includes('Error') ? '#ffcdd2' : '#c8e6c9'}`
        }}>
          Updating...
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
              websiteLink = {websiteLinkInput} websiteLinkSetter = {setWebsiteLinkInput} websiteLinkOnChange = {handleWebsiteLinkChange} websiteLinkOnBlur = {handleWebsiteLinkBlur} websiteLinkErrorMessage = {websiteLinkInputErrorMessage}
              bio = {bioInput} bioSetter = {setBioInput}
              videos = {videosInput} videosSetter = {setVideosInput}
              locations = {locationsInput} locationSetter={setLocationsInput}
              id = {id}
              customContent={customContentInput} customContentSetter={setCustomContentInput}
              QrCodeColor={qrCodeColorInput} QrCodeColorSetter={setQrCodeColorInput} 

              addSocialMediaModalVisibiltySetter = {setAddSocialMediaModalIsVisible}

              addVideoModalVisibiltySetter = {setAddVideoModalIsVisible}
              updateVideoModalVisibiltySetter = {setUpdateVideoModalIsVisible}
              videoObjectUnderUpdateSetter = {setVideoObjectUnderUpdate}

              addLocationModalVisibiltySetter = {setAddAdressModalIsVisible}
              updateLocationModalVisibiltySetter = {setUpdateAdressModalIsVisible}
              locationObjectUnderUpdateSetter = {setLocationObjectUnderUpdate}

      >
      </TwoColumnLayout>
      <Footer />

      {/* Hidden Modasl*/}
      <AddSocialMediaModal 
        visible={addSocialMediaModalIsVisible}
        onClose={() => setAddSocialMediaModalIsVisible(false)}
        setter={setConnectLinksInput}
      />
      <AddVideoModal
        visible={addVideoModalIsVisible}
        onClose={() => setAddVideoModalIsVisible(false)}
        setter={setVideosInput}
      />
      <EditVideoModal
        videoObject={videoObjectUnderUpdate}
        visible={updateVideoModalIsVisible}
        onClose={() => setUpdateVideoModalIsVisible(false)}
        setter={setVideosInput}
      />
      <AddLocationModal
        visible={addAdressModalIsVisible}
        onClose={() => setAddAdressModalIsVisible(false)}
        setter={setLocationsInput}
      />
      <EditLocationModal
        locationObject={locationObjectUnderUpdate}
        visible={updateAdressModalIsVisible}
        onClose={() => setUpdateAdressModalIsVisible(false)}
        setter={setLocationsInput}
      />
    </div>
  )
}

export default EditUserProfile
