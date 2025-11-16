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
                        links={connectLinksInput} 
                        setter={setConnectLinksInput} 
                        // addAction={()=>addSocialMediaModalVisibiltySetter(true)}
                    />

                    <YoutubeVideos 
                        videos={videosInput}
                        setter={setVideosInput}
                        // addAction={()=>addVideoModalVisibiltySetter(true)}
                        // updateAction={()=>updateVideoModalVisibiltySetter(true)}
                        // objectSetter={videoObjectUnderUpdateSetter}
                    />
                    <AddressCards
                        addresses={locationsInput}
                        setter={setLocationsInput}
                        // addAction={()=>addLocationModalVisibiltySetter(true)}
                        // updateAction={()=>updateLocationModalVisibiltySetter(true)}
                        // objectSetter={locationObjectUnderUpdateSetter}
                    />

                    <ProfileQrCode id={id}/>
                    
                    
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