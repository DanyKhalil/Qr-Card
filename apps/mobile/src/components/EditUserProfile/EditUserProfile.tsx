import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CoverPhoto from './CoverPhoto/CoverPhoto';
import ProfilePic from './ProfilePIc/ProfilePic';
import Button from '../UserProfile/Button/Button';
import ProfileQrCode from './ProfileQrCode/ProfileQrCode';
import { router, useRouter } from 'expo-router';
import TitleAndFields from './TitleAndFields/TitleAndFields';
import TitleAndLinks from './TitleAndLinks/TitleAndLinks';
import YoutubeVideos from './YoutubeVideos/YoutubeVideos';
import AddressCards from './AddressCards/AddressCards';
import { userApi } from '@/src/services/userApi';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Modal, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AddSocialMediaModal from './Modals/AddSocialMediaModal/AddSocialMediaModel';
import AddVideoModal from './Modals/AddVideoModal/AddVideoModal';
import AddLocationModal from './Modals/AddLocationModal/AddLocationModal';
import EditLocationModal from './Modals/EditLocationModal/EditLocationModal';
import EditVideoModal from './Modals/EditVideoModal/EditVideoModal';
import { useNavigation } from '@react-navigation/native';
import { DEVELOPMENT_CONFIG } from '../../config/development';
import CustomContentSection from './CustomContentSection/CustomContentSection';

interface EditUserProfileProps {
    coverPhoto?: string;
    profilePic?: string;
    userName?: string;
    dob?: string;
    headline?: string;
    contactLinks?: any[];
    connectLinks?: any[];
    websiteLink?: string;
    bio?: string;
    videos?: any[];
    locations?: any[];
    id?: string;
    customContent?: any[];
}

const EditUserProfile = ({
        coverPhoto,
        profilePic,
        userName = "User Name",
        dob,
        headline = "Your headline here",
        contactLinks = [],
        connectLinks = [],
        websiteLink,
        bio = "Your bio here",
        videos = [],
        locations = [],
        id = "User001",
        customContent = [],
        QrCodeColor,
        includeProfilePic,
        includeContact,
        includeSocialMedia,
        includeWebsite,
    }: EditUserProfileProps) => {
        // for files

        const [coverPhotoInput, setCoverPhotoInput] = useState(coverPhoto);

        const [profilePicInput, setProfilePicInput] = useState(profilePic);

        // const [coverPhotoInputErrorMessage, setCoverPhotoInputErrorMessage] = useState('');
        // const [profilePicInputErrorMessage, setProfilePicInputErrorMessage] = useState('');
    
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
        const handleUserNameChange = (value) => {
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
        const handleDobChange = (value) => {
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
    
        const [phoneNumberInput, setPhoneNumberInput] = useState(contactLinks[1].name[0]);
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
        const handlePhoneNumberChange = (value) => {
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
        const handleWebsiteLinkChange = (value) => {
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
    
        const [videosInput, setVideosInput] = useState(videos);
    
        const [locationsInput, setLocationsInput] = useState(locations);

        const [customContentInput, setCustomContentInput] = useState(customContent || []);

        const [qrCodeColorInput, setQrCodeColorInput] = useState(QrCodeColor);
        const [includeProfilePicInput, setIncludeProfilePicInput] = useState(includeProfilePic);
        const [includeContactInput, setIncludeContactInput] = useState(includeContact);
        const [includeSocialMediaInput, setIncludeSocialMediaInput] = useState(includeSocialMedia);
        const [includeWebsiteInput, setIncludeWebsiteInput] = useState(includeWebsite);




        /// for modals
        const [addSocialMediaModalIsVisible, setAddSocialMediaModalIsVisible] = useState(false);
        const [addVideoModalIsVisible, setaddVideoModalIsVisible] = useState(false);
        const [addLocationModalIsVisible, setAddLocationModalIsVisible] = useState(false);

        const [updateVideoModalIsVisible, setUpdateVideoModalIsVisible] = useState(false);
        const [updateAdressModalIsVisible, setUpdateAdressModalIsVisible] = useState(false);

        const [videoObjectUnderUpdate, setVideoObjectUnderUpdate] = useState({id:'', title:'', description:'', video_url:''})
        const [locationObjectUnderUpdate, setLocationObjectUnderUpdate] = useState({id:'', title:'', floor:'', building:'', street:'', city:'', state:'', country:'', maps_url:''})



        let personalInformationFields = [
            {label:"Name", type: "text", id: "name", value: userNameInput, setter: setUserNameInput, onChange: handleUserNameChange, onBlur: handleUserNameBlur, errorMessage: userNameInputErrorMessage},
            {label:"Date of Birth", type: "date", id: "dob", value: dobInput, setter: setDobInput, onChange: handleDobChange, onBlur: handleDobBlur, errorMessage: dobInputErrorMessage},
            {label:"Phone No.", type: "text", id: "phone-pad", value: phoneNumberInput, setter: setPhoneNumberInput, onChange: handlePhoneNumberChange, onBlur: handlePhoneNumberBlur, errorMessage: phoneNumberInputErrorMessage}
        ];

        let profileSummaryFields = [
            {label:"Headline", type:"text", id: "headline", value: headlineInput, setter: setHeadlineInput, onChange: (value)=>setHeadlineInput(value),},
            {label:"Description", type:"text", id:"bio", value:bioInput, setter:setBioInput, onChange: (value)=>setBioInput(value), multiline: true}
        ]

        let websiteFields = [{label:"URL", type:"text", id: "website_url", value: websiteLinkInput, setter:setWebsiteLinkInput, onChange: handleWebsiteLinkChange, onBlur: handleWebsiteLinkBlur, errorMessage: websiteLinkInputErrorMessage}]


        function normalizeUrl(url: string) {
            if (!url) return null;
            if (url.startsWith("http://") || url.startsWith("https://")) {
                return url;
            }
            return "https://" + url;
        }
        const processConnectLinks = (connectLinksInput) => {
            if (!connectLinksInput) 
                return [];

            return connectLinksInput.map((link: any) => {
                try {
                    let rawUrl = link.url || link;

                    const url = normalizeUrl(rawUrl);

                    const hostname = new URL(url).hostname.replace("www.", "");
                    const icon = hostname.split(".")[0];

                    const username = url.split("/").filter(Boolean).pop();

                    return {
                        id: link.id,
                        iconName: icon,
                        name: `@${username}`,
                        link: url
                    };
                } catch (error) {
                    console.error("Invalid URL:", link.url);
                    return null;
                }
            }).filter(Boolean);
        };





        // Profile and Cover change and remoev functions
        const handleProfilePicChange = async () => {
            try {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permissionResult.granted) {
                    Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
                    return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });

                if (!result.canceled && result.assets[0]) {
                    setProfilePicInput(result.assets[0].uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to pick image');
            }
        };

        const handleRemoveProfilePic = () => {
            Alert.alert(
                'Remove Profile Picture',
                'Are you sure you want to remove your profile picture?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Remove', 
                        style: 'destructive',
                        onPress: () => setProfilePicInput('')
                    }
                ]
            );
        };

        // Cover Photo Functions
        const handleCoverPhotoChange = async () => {
            try {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permissionResult.granted) {
                    Alert.alert('Permission Required', 'Please allow access to your photo library to change cover photo.');
                    return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [3, 1],
                    quality: 0.8,
                });

                if (!result.canceled && result.assets[0]) {
                    setCoverPhotoInput(result.assets[0].uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to pick image');
            }
        };

        const handleRemoveCoverPhoto = () => {
            Alert.alert(
                'Remove Cover Photo',
                'Are you sure you want to remove your cover photo?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Remove', 
                        style: 'destructive',
                        onPress: () => setCoverPhotoInput('')
                    }
                ]
            );
        };


        const [isUpdating, setIsUpdating] = useState(false);
        const [updateMessage, setUpdateMessage] = useState('');
        const [showSuccessModal, setShowSuccessModal] = useState(false);

        const transformImageUrl = (url: string) => {
            if (!url) 
                return url;
            let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
            return transformedUrl;
        };



        // const navigate = useNavigate()
        const router = useRouter();

        // for sending save request put
        const handleUserProfileUpdate = async (newUserName, newDob, newPhoneNumber, newHeadline, newBio, newWebsite, newSocialMediaLinks, newVideos, newLocations, newCustomContent) => {
            setIsUpdating(true);
            setUpdateMessage('');

            try {
                // Extract images from custom content exactly like web version
                const { cleanCustomContent, imageFiles } = extractImagesFromCustomContent(customContentInput);
                
                const result = await userApi.updateUserProfile({
                    userId: id,
                    userName: userNameInput,
                    dob: dobInput,
                    phoneNumber: phoneNumberInput,
                    headline: headlineInput,
                    bio: bioInput,
                    website: websiteLinkInput,
                    connectLinks: connectLinksInput,
                    videos: videosInput,
                    locations: locationsInput,
                    profilePicInput: profilePicInput,
                    coverPhotoInput: coverPhotoInput,
                    customContent: cleanCustomContent, // Use cleaned custom content
                    customImages: imageFiles, // Pass image files for processing
                    qrCodeColor: qrCodeColorInput,
                    qr_code_include_profile_pic: includeProfilePicInput,
                    qr_code_include_contact: includeContactInput,
                    qr_code_include_social: includeSocialMediaInput,
                    qr_code_include_website: includeWebsiteInput,
                });

                if (result.success) {
                    setIsUpdating(false);
                    setShowSuccessModal(true);
                    
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        router.back();
                    }, 2000);
                }
            } catch (error) {
                setIsUpdating(false);
                setUpdateMessage(`Error: ${error.message || 'Network Error'}`);
                setTimeout(() => setUpdateMessage(''), 5000);
            }
        };

        // Exact React Native version of web's extractImagesFromCustomContent
        const extractImagesFromCustomContent = (customContent) => {
            if (!customContent || !Array.isArray(customContent)) {
                return { cleanCustomContent: [], imageFiles: [] };
            }
            
            // Deep clone the custom content
            const cleanCustomContent = JSON.parse(JSON.stringify(customContent));
            const imageFiles = [];
            
            // Process exactly like web version: contentType -> items -> values
            customContent.forEach((contentType, typeIndex) => {
                if (contentType.items && Array.isArray(contentType.items)) {
                    contentType.items.forEach((item, itemIndex) => {
                        if (item.values && Array.isArray(item.values)) {
                            item.values.forEach((value, valueIndex) => {
                                // In React Native, check if value.value is a file object with uri
                                if (value.field_type === 'image' && value.value && value.value.uri) {
                                    // Generate unique key exactly like web version
                                    const imageKey = `${typeIndex}_${itemIndex}_${valueIndex}`;
                                    
                                    // Get file info from React Native image object
                                    const file = value.value;
                                    
                                    // Store the file with the key
                                    imageFiles.push({
                                        key: imageKey,
                                        file: {
                                            uri: file.uri,
                                            type: file.type || 'image/jpeg',
                                            name: file.fileName || `custom_image_${imageKey}.jpg`
                                        }
                                    });
                                    
                                    // Replace with placeholder exactly like web version
                                    cleanCustomContent[typeIndex].items[itemIndex].values[valueIndex].value = `__IMAGE_PLACEHOLDER_${imageKey}__`;
                                }
                                // Also handle if value.value is a string URI (fallback)
                                else if (value.field_type === 'image' && value.value && typeof value.value === 'string' && value.value.startsWith('file://')) {
                                    // Generate unique key
                                    const imageKey = `${typeIndex}_${itemIndex}_${valueIndex}`;
                                    
                                    // Extract filename from URI
                                    const filename = value.value.split('/').pop() || `custom_image_${imageKey}.jpg`;
                                    
                                    // Store the file
                                    imageFiles.push({
                                        key: imageKey,
                                        file: {
                                            uri: value.value,
                                            type: 'image/jpeg',
                                            name: filename
                                        }
                                    });
                                    
                                    // Replace with placeholder
                                    cleanCustomContent[typeIndex].items[itemIndex].values[valueIndex].value = `__IMAGE_PLACEHOLDER_${imageKey}__`;
                                }
                            });
                        }
                    });
                }
            });
            
            return { cleanCustomContent, imageFiles };
        };
    
        const handleSaveChanges = () => {
            handleUserProfileUpdate(userNameInput, dobInput, phoneNumberInput, headlineInput, bioInput, websiteLinkInput, connectLinksInput, videosInput, locationsInput, customContentInput);
        };


        return (
            <>
                <ScrollView style={{ flex: 1 }}>
                    <CoverPhoto 
                        photo={transformImageUrl(coverPhotoInput)} 
                        height={150} 
                        onCoverChange={handleCoverPhotoChange}
                        onCoverRemove={handleRemoveCoverPhoto}
                    />
                    <View style={styles.profileSection}>
                        <ProfilePic 
                            photo={transformImageUrl(profilePicInput)} 
                            size="xxlarge" 
                            onProfileChange = {handleProfilePicChange}
                            onProfileRemove = {handleRemoveProfilePic}
                        />
                        <View style={styles.buttonsColumn}>
                            <Button 
                                text="Save"
                                color="green"
                                disabled={userNameInputErrorMessage != '' 
                                    || dobInputErrorMessage != '' 
                                    || phoneNumberInputErrorMessage != '' 
                                    || websiteLinkInputErrorMessage != ''}
                                onPress={() => handleSaveChanges()}
                                width={180}
                            />
                            <Button 
                                text="Cancel"
                                color="coral"
                                onPress={() => router.back()}
                                width={180}
                                style={{ marginTop: 12 }}
                            />
                        </View>
                    </View>

                    <TitleAndFields title="Personal Information" fields={personalInformationFields}/>
                    <TitleAndFields title="Profile Summary" fields={profileSummaryFields}/>
                    <TitleAndFields title="Website" fields={websiteFields}/>

                    <TitleAndLinks 
                        title="Social Media" 
                        links={processConnectLinks(connectLinksInput)} 
                        setter={setConnectLinksInput} 
                        addAction={()=>setAddSocialMediaModalIsVisible(true)}
                    />

                    <YoutubeVideos 
                        videos={videosInput}
                        setter={setVideosInput}
                        addAction={()=>setaddVideoModalIsVisible(true)}
                        updateAction={()=>setUpdateVideoModalIsVisible(true)}
                        objectSetter={setVideoObjectUnderUpdate}
                    />
                    <AddressCards
                        addresses={locationsInput}
                        setter={setLocationsInput}
                        addAction={()=>setAddLocationModalIsVisible(true)}
                        updateAction={()=>setUpdateAdressModalIsVisible(true)}
                        objectSetter={setLocationObjectUnderUpdate}
                    />

                    <CustomContentSection
                        customContent={customContentInput}
                        setCustomContent={setCustomContentInput}
                    />

                    <ProfileQrCode id={id} 
                        color={qrCodeColorInput} 
                        setter={setQrCodeColorInput}
                        includeProfilePic={includeProfilePicInput}
                        setIncludeProfilePic={setIncludeProfilePicInput}
                        includeContact={includeContactInput}
                        setIncludeContact={setIncludeContactInput}
                        includeSocialMedia={includeSocialMediaInput}
                        setIncludeSocialMedia={setIncludeSocialMediaInput}
                        includeWebsite={includeWebsiteInput}
                        setIncludeWebsite={setIncludeWebsiteInput}
                    />


                    <AddSocialMediaModal 
                        visible={addSocialMediaModalIsVisible}
                        onClose={() => setAddSocialMediaModalIsVisible(false)}
                        setter={setConnectLinksInput}
                    />
                    <AddVideoModal 
                        visible={addVideoModalIsVisible}
                        onClose={() => setaddVideoModalIsVisible(false)}
                        setter={setVideosInput}
                    />
                    <AddLocationModal 
                        visible={addLocationModalIsVisible}
                        onClose={() => setAddLocationModalIsVisible(false)}
                        setter={setLocationsInput}
                    />
                    <EditVideoModal
                        videoObject={videoObjectUnderUpdate}
                        visible={updateVideoModalIsVisible}
                        onClose={() => setUpdateVideoModalIsVisible(false)}
                        setter={setVideosInput}
                    />
                    <EditLocationModal
                        locationObject={locationObjectUnderUpdate}
                        visible={updateAdressModalIsVisible}
                        onClose={() => setUpdateAdressModalIsVisible(false)}
                        setter={setLocationsInput}
                    />
                </ScrollView>

                {/* Suuccess and waiting modasl */}
                <Modal
                    visible={isUpdating}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.loadingModal}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.loadingText}>Updating Profile...</Text>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.successModal}>
                            <View style={styles.successIcon}>
                                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                            </View>
                            <Text style={styles.successTitle}>Success!</Text>
                            <Text style={styles.successMessage}>Profile updated successfully</Text>
                        </View>
                    </View>
                </Modal>

                {updateMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{updateMessage}</Text>
                    </View>
                ) : null}
            </>
        );
};


const styles = StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 16,
    },
    buttonsColumn: {
        marginLeft: 20,
        justifyContent: 'flex-start',
    },


    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingModal: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 200,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },
    successModal: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 250,
    },
    successIcon: {
        marginBottom: 15,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 15,
        margin: 20,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
    },
});

export default EditUserProfile;