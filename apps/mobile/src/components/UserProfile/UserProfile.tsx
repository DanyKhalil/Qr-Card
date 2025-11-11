import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoverPhoto from './CoverPhoto/CoverPhoto';
import ProfilePic from './ProfilePIc/ProfilePic';
import Headline from './Headline/Headline';


interface UserProfileProps {
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

const UserProfile = ({
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
    }: UserProfileProps) => {
        return (
                <ScrollView style={{ flex: 1 }}>
                    <CoverPhoto photo={coverPhoto} height={150} />
                    <ProfilePic photo={profilePic} size='xxlarge' />
                    <Headline name={userName} dob={dob} headline={headline} />
                    
                    
                </ScrollView>
        );
};

export default UserProfile;