import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoverPhoto from './CoverPhoto/CoverPhoto';
import ProfilePic from './ProfilePIc/ProfilePic';
import Headline from './Headline/Headline';
import Button from './Button/Button';
import AnimatedButton from './Button/AnimatedButton';
import DescriptionText from './DescriptionText/DescriptionText';
import YouTubePreview from './YoutubePreview/YoutubePreview';
import YouTubeVideos from './YoutubeVideos/YoutubeVideos';


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
                    <View style={styles.profileSection}>
                        <ProfilePic photo={profilePic} size='xxlarge' />
                        <View style={styles.buttonsColumn}>
                            <Button 
                                text="Profile Analytics"
                                color="green"
                                onPress={() => console.log('Profile Analytics')}
                                width={180}
                            />
                            <Button 
                                text="Edit Profile"
                                color="coral"
                                onPress={() => console.log('Edit Profile')}
                                width={180}
                                style={{ marginTop: 12 }}
                            />
                        </View>
                    </View>
                    <Headline name={userName} dob={dob} headline={headline} />

                    <DescriptionText text={bio} />

                    <YouTubeVideos
                        userName={userName}
                        videos={videos}
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

export default UserProfile;