// import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {View,Text,  ActivityIndicator,  Alert,ScrollView } from 'react-native';
import {useFocusEffect, useLocalSearchParams } from 'expo-router';
import UserProfileComponent from '../components/UserProfile/UserProfile';
import { userApi } from '../services/userApi';
import { profileAnalyticsApi} from '../services/profileAnalyticsApi';
import Button from '../components/UserProfile/Button/Button';
import { DEVELOPMENT_CONFIG } from '../config/development';



const UserProfilePage = () => {
    const { id, qrScan } = useLocalSearchParams();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const hasVisited = useRef(false);

    useFocusEffect(
        React.useCallback(() => {
            // This will run every time the screen comes into focus
            fetchUserProfile(Array.isArray(id) ? id[0] : id);
        }, [id])
    );

    const fetchUserProfile = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getUserProfile(userId);
            setUserData(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch user profile');
            console.error('Error in fetchUserProfile:', err);
        } finally {
            setLoading(false);
        }
    };

    const visitProfile = async (userId: string, isQrScan: boolean) => {
        if (!hasVisited.current) {
            hasVisited.current = true;
            try {
                await profileAnalyticsApi.visitUserProfile(userId, isQrScan);
            } catch (err) {
                console.error('Error in visitProfile:', err);
            }
        }
    };

    useEffect(() => {
        if (id) {
            const userId = Array.isArray(id) ? id[0] : id;
            const isQrScan = qrScan === 'true';
            
            fetchUserProfile(userId);
            visitProfile(userId, isQrScan);
        }
    }, [id, qrScan]);

    // constructing contact links array becuase it is not an array in the respone of the backend
    const processContactLinks = () => {
        if (!userData) 
            return [];
        
        const contactLinks = [];

        if (userData.email) {
            contactLinks.push({name: userData.email, iconName: 'email', link: userData.email });
        }
        
        if (userData.phone_number) {
            contactLinks.push({name: userData.phone_number, iconName: 'phone', link: userData.phone_number });
        }
        
        return contactLinks;
    };

    function normalizeUrl(url: string) {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return "https://" + url;
    }
    
    // constructing the conect links
    const processConnectLinks = () => {
        if (!userData?.social_media_links) 
            return [];

        return userData.social_media_links.map((link: any) => {
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

    // changing the url of images (TEMPORARYYYYY)
    const transformImageUrl = (url: string) => {
        if (!url) 
            return url;
        let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
        return transformedUrl;
    };


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#82C294" />
                <Text style={{ marginTop: 16 }}>Loading user profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'red', marginBottom: 16 }}>Error: {error}</Text>
                <Button 
                    text="Retry" 
                    onPress={() => id && fetchUserProfile(Array.isArray(id) ? id[0] : id)}
                    color="coral"
                />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No user data found</Text>
            </View>
        );
    }

    const contactLinks = processContactLinks();
    const connectLinks = processConnectLinks();

    return (
        <UserProfileComponent
            coverPhoto={transformImageUrl(userData.cover_photo_url)}
            profilePic={transformImageUrl(userData.profile_pic_url)}
            userName={userData.name}
            dob={userData.dob}
            headline={userData.headline}
            contactLinks={contactLinks}
            connectLinks={connectLinks}
            websiteLink={userData.website_link}
            bio={userData.bio}
            videos={userData.videos_links}
            locations={userData.locations}
            id={Array.isArray(id) ? id[0] : id || 'User001'}
        />
    );
};

export default UserProfilePage;