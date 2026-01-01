import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CoverPhoto from './CoverPhoto/CoverPhoto';
import ProfilePic from './ProfilePIc/ProfilePic';
import Headline from './Headline/Headline';
import Button from './Button/Button';
import DescriptionText from './DescriptionText/DescriptionText';
import YouTubeVideos from './YoutubeVideos/YoutubeVideos';
import Locations from './Locations/Locations';
import TitleAndLinks from './TitleAndLinks/TitleAndLinks';
import ProfileQrCode from './ProfileQrCode/ProfileQrCode';
import { router } from 'expo-router';
import CustomContentDisplay from './CustomContentDisplay/CustomContentDisplay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupComponent from './Popup/Popup';

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
    profileId?: string;
    customContent?: any[];
    followers?: number;
    following?: number;
    fetchUserProfile?: any;
    QrCodeColor?: string;
    includeContact?: boolean;
    includeSocialMedia?: boolean;
    includeWebsite?: boolean;
    includeProfilePic?: boolean;
    scrollToBottom?: boolean;
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
        profileId,
        customContent = [],
        followers,
        following,
        fetchUserProfile,
        QrCodeColor,
        includeContact,
        includeSocialMedia,
        includeWebsite,
        includeProfilePic,
        scrollToBottom = false,
    }: UserProfileProps) => {

        const scrollRef = useRef<ScrollView>(null);

        // ---------------------- Scroll to bottom if requested ----------------------
        useEffect(() => {
            if (scrollToBottom) {
                // wait a short time to ensure content is rendered
                setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        }, [scrollToBottom]);

        // ---------------------- Update profileId in AsyncStorage ----------------------
        useEffect(() => {
            const updateProfileId = async () => {
                try {
                const userStr = await AsyncStorage.getItem("user");
                if (!userStr) return;


                const currentUser = JSON.parse(userStr);

                // Only update profileId if the current user matches the profile being viewed
                if (currentUser?.id === id && profileId) {
                    await AsyncStorage.setItem("profileId", profileId);
                }
                } catch (error) {
                console.error("Error parsing user data:", error);
                }
            };
            updateProfileId();
        }, [profileId, id]);

        // ---------------------- Get logged-in user ID & profile ----------------------
        const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
        const [loggedInUserProfileId, setLoggedInUserProfileId] = useState<string | null>(null);

        useEffect(() => {
            const fetchUserId = async () => {
                try {
                    const loggedInUserString = await AsyncStorage.getItem("user");
                    const profileIdStored = await AsyncStorage.getItem("profileId");

                    if (loggedInUserString) {
                        const loggedInUser = JSON.parse(loggedInUserString);
                        setLoggedInUserId(loggedInUser.id || null);
                    }
                    setLoggedInUserProfileId(profileIdStored || null);
                } catch (error) {
                    console.error("Error fetching logged-in user data:", error);
                }
            };
            fetchUserId();
        }, []);

        return (
                <ScrollView ref={scrollRef} style={{ flex: 1 }}>
                    <CoverPhoto photo={coverPhoto} height={150} />
                    <View style={styles.profileSection}>
                        <ProfilePic photo={profilePic} size="xxlarge" />
                        {loggedInUserProfileId === profileId ? (
                            <View style={styles.buttonsColumn}>
                                <Button
                                    text="Profile Analytics"
                                    color="green"
                                    onPress={() => router.push(`/(stack)/profile-analytics/${id}`)}
                                    width={180}
                                />
                                <Button
                                    text="Edit Profile"
                                    color="coral"
                                    onPress={() => router.push(`/(stack)/edit-profile/${id}`)}
                                    width={180}
                                    style={{ marginTop: 12 }}
                                />
                            </View>
                        ) : (
                            <View style={styles.buttonsColumn} />
                        )}
                    </View>

                <Headline
                    name={userName}
                    profileId={profileId}
                    dob={dob}
                    headline={headline}
                    id={id}
                    followers={followers}
                    following={following}
                    fetchUserProfile={fetchUserProfile}
                />

                <DescriptionText text={bio} />

                <YouTubeVideos userName={userName} videos={videos} />
                <Locations locations={locations} />

                {customContent.map((content) => (
                    <CustomContentDisplay key={content.id} customContent={content} />
                ))}

                <TitleAndLinks title="Contact" links={contactLinks} />
                <TitleAndLinks title="Connect" links={connectLinks} />
                {websiteLink && (
                    <TitleAndLinks
                        title="Website"
                        links={[{ name: websiteLink, iconName: "web" }]}
                    />
                )}

                {loggedInUserProfileId === profileId && (
                    <ProfileQrCode
                        id={id}
                        color={QrCodeColor}
                        name={userName}
                        userLinks={
                            (includeContact ? contactLinks : [])
                                .concat(includeSocialMedia ? connectLinks : [])
                                .concat(
                                    includeWebsite
                                        ? [{ name: websiteLink, iconName: "web" }].filter(
                                            (link) => link.name && String(link.name).trim() !== ''
                                        )
                                        : []
                                )
                        }
                        image={includeProfilePic ? profilePic : null}
                    />
                )}

                {loggedInUserProfileId !== profileId && <View style={{ height: 64 }} />}

                {!loggedInUserId && <PopupComponent />}
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
