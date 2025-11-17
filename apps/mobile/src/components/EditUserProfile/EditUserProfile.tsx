import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CoverPhoto from '../UserProfile/CoverPhoto/CoverPhoto';
import ProfilePic from '../UserProfile/ProfilePIc/ProfilePic';
import Button from '../UserProfile/Button/Button';
import ProfileQrCode from '../UserProfile/ProfileQrCode/ProfileQrCode';
import { router } from 'expo-router';
import TitleAndFields from './TitleAndFields/TitleAndFields';
import TitleAndLinks from './TitleAndLinks/TitleAndLinks';
import YoutubeVideos from './YoutubeVideos/YoutubeVideos';
import AddressCards from './AddressCards/AddressCards';

import AddSocialMediaModal from './Modals/AddSocialMediaModal/AddSocialMediaModel';
import AddVideoModal from './Modals/AddVideoModal/AddVideoModal';
import AddLocationModal from './Modals/AddLocationModal/AddLOcationModal';
import EditLocationModal from './Modals/EditLocationModal/EditLocationModal';
import EditVideoModal from './Modals/EditVideoModal/EditVideoModal';

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
    }: EditUserProfileProps) => {

        const [coverPhotoInput, setCoverPhotoInput] = useState(coverPhoto);
        const [coverPhotoInputErrorMessage, setCoverPhotoInputErrorMessage] = useState('');
    
        const [profilePicInput, setProfilePicInput] = useState(profilePic);
        const [profilePicInputErrorMessage, setProfilePicInputErrorMessage] = useState('');
    
        const [userNameInput, setUserNameInput] = useState(userName);
        const [userNameInputErrorMessage, setUserNameInputErrorMessage] = useState('');
    
        const [dobInput, setDobInput] = useState(dob);
        const [dobInputErrorMessage, setDobInputErrorMessage] = useState('');
    
        const [headlineInput, setHeadlineInput] = useState(headline);
        const [headlineInputErrorMessage, setHeadlineInputErrorMessage] = useState('');
    
        const [phoneNumberInput, setPhoneNumberInput] = useState(contactLinks[1].name[0]);
        const [phoneNumberInputErrorMessage, setPhoneNumberInputErrorMessage] = useState('');
    
        const [connectLinksInput, setConnectLinksInput] = useState(connectLinks);
        const [connectLinksInputErrorMessage, setConnectLinksInputErrorMessage] = useState('');
    
        const [websiteLinkInput, setWebsiteLinkInput] = useState(websiteLink);
        const [websiteLinkInputErrorMessage, setWebsiteLinkInputErrorMessage] = useState('');
    
        const [bioInput, setBioInput] = useState(bio);
        const [bioInputErrorMessage, setBioInputErrorMessage] = useState('');
    
        const [videosInput, setVideosInput] = useState(videos);
        const [videosInputErrorMessage, setVideosInputErrorMessage] = useState('');
    
        const [locationsInput, setLocationsInput] = useState(locations);
        const [locationsInputErrorMessage, setLocationsInputErrorMessage] = useState('');



        /// for modals
        const [addSocialMediaModalIsVisible, setAddSocialMediaModalIsVisible] = useState(false);
        const [addVideoModalIsVisible, setaddVideoModalIsVisible] = useState(false);
        const [addLocationModalIsVisible, setAddLocationModalIsVisible] = useState(false);

        const [updateVideoModalIsVisible, setUpdateVideoModalIsVisible] = useState(false);
        const [updateAdressModalIsVisible, setUpdateAdressModalIsVisible] = useState(false);

        const [videoObjectUnderUpdate, setVideoObjectUnderUpdate] = useState({id:'', title:'', description:'', video_url:''})
        const [locationObjectUnderUpdate, setLocationObjectUnderUpdate] = useState({id:'', title:'', floor:'', building:'', street:'', city:'', state:'', country:'', maps_url:''})



        let personalInformationFields = [
            {label:"Name", type: "text", id: "name", value: userNameInput, setter: setUserNameInput},
            {label:"Date of Birth", type: "date", id: "dob", value: dobInput, setter: setDobInput},
            {label:"Phone No.", type: "text", id: "phone-pad", value: phoneNumberInput, setter: setPhoneNumberInput}
        ];

        let profileSummaryFields = [
            {label:"Headline", type:"text", id: "headline", value: headlineInput, setter: setHeadlineInput},
            {label:"Description", type:"text", id:"bio", value:bioInput, setter:setBioInput, multiline: true}
        ]

        let websiteFields = [{label:"URL", type:"text", id: "website_url", value: websiteLinkInput, setter:setWebsiteLinkInput}]


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

        return (
                <ScrollView style={{ flex: 1 }}>
                    <CoverPhoto photo={coverPhoto} height={150} />
                    <View style={styles.profileSection}>
                        <ProfilePic photo={profilePic} size="xxlarge" />
                        <View style={styles.buttonsColumn}>
                            <Button 
                                text="Save"
                                color="green"
                                onPress={() => console.log('Profile Saved.')}
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

                    <ProfileQrCode id={id}/>


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
});

export default EditUserProfile;