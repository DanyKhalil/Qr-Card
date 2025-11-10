import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoverPhoto from './CoverPhoto/CoverPhoto';


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
                    
                    
                    <ProfileContentPlaceholder 
                        userName={userName}
                        headline={headline}
                        bio={bio}
                    />
                </ScrollView>
        );
};

// Temporary placeholder for other components
const ProfileContentPlaceholder = ({ userName, headline, bio }: any) => {
  return (
    <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            {userName}
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
            {headline}
        </Text>
        <Text style={{ fontSize: 14, color: '#333' }}>
            {bio}
        </Text>
    </View>
  );
};

export default UserProfile;