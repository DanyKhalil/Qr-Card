import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Linking } from 'react-native';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserProfileComponent from '../components/UserProfile/UserProfile';
import LockedAccountScreen from '../components/UserProfile/LockedAccount/LockedAccount';
import Button from '../components/UserProfile/Button/Button';
import { userApi } from '../services/userApi';
import { profileAnalyticsApi } from '../services/profileAnalyticsApi';
import { DEVELOPMENT_CONFIG } from '../config/development';

const UserProfilePage = ({ id }) => {
    const { qrScan } = useLocalSearchParams();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [profileId, setProfileId] = useState<string | null | undefined>(undefined);

    const hasVisited = useRef(false);

    // ----------------------
    // Load logged-in user data
    // ----------------------
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const userString = await AsyncStorage.getItem('user');

                if (storedToken && userString) {
                    setToken(storedToken);
                    setUser(JSON.parse(userString));
                } else {
                    setToken(null);
                    setUser(null);
                }
            } catch (err) {
                console.error('[DEBUG] Error loading user data:', err);
            }
        };

        loadUserData();
    }, []);

    // ----------------------
    // Load logged-in profileId
    // ----------------------
    useEffect(() => {
        const loadProfileId = async () => {
            try {
                const storedProfileId = await AsyncStorage.getItem('profileId');
                setProfileId(storedProfileId); // can be null
            } catch (err) {
                console.error('[DEBUG] Error loading profileId:', err);
                setProfileId(null);
            }
        };
        loadProfileId();
    }, []);

    // ----------------------
    // Fetch user profile immediately (no need to wait for profileId)
    // ----------------------
    const fetchUserProfile = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getUserProfile(userId);
            setUserData(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch user profile');
            console.error('[DEBUG] Error in fetchUserProfile:', err);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // Visit profile analytics (waits until profileId is loaded)
    // ----------------------
    const visitProfile = async (visitedUserId: string, isQrScan: boolean) => {
        if (!hasVisited.current) {
            hasVisited.current = true;
            try {
                // Send visit analytics, allow anonymous if profileId is null
                if (visitedUserId !== profileId) {
                    await profileAnalyticsApi.visitUserProfile(visitedUserId, isQrScan);
                } else {
                }
            } catch (err) {
                console.error('[DEBUG] Error in visitProfile:', err);
            }
        }
    };

    // ----------------------
    // useEffect: fetch profile whenever id changes
    // ----------------------
    useEffect(() => {
        if (!id) return;
        const userId = Array.isArray(id) ? id[0] : id;
        const isQrScan = qrScan === 'true';
        fetchUserProfile(userId);
    }, [id, qrScan]);

    // ----------------------
    // useEffect: send visit analytics once profileId has loaded
    // ----------------------
    useEffect(() => {
        if (!id) return;
        if (profileId === undefined) return; // wait until AsyncStorage is read

        const userId = Array.isArray(id) ? id[0] : id;
        const isQrScan = qrScan === 'true';
        visitProfile(userId, isQrScan);
    }, [id, qrScan, profileId]);

    // ----------------------
    // Subscription logic
    // ----------------------
    const getSubscriptionMessage = () => {
        if (!userData?.subscription || user?.role === 'admin') return null;
        const { status, is_active } = userData.subscription;
        if (is_active) return null;

        let title = '';
        let message = '';
        let actionText = '';
        let actionLink = '';

        switch (status) {
            case 'pending':
                title = 'Payment Under Review';
                message = 'We have received your payment. Our team is reviewing it and will activate your subscription shortly.';
                actionText = 'Contact Support';
                actionLink = 'mailto:danikhalil2004@gmail.com';
                break;
            case 'expired':
                title = 'Subscription Expired';
                message = 'Your subscription has expired. Please renew to regain access.';
                actionText = 'Renew';
                actionLink = `/subscribe/123?profile_id=${userData.profile_id}`;
                break;
            case 'cancelled':
                title = 'Subscription Cancelled';
                message = 'Your subscription was cancelled. Please subscribe again to continue.';
                actionText = 'Subscribe Again';
                actionLink = `/subscribe/123?profile_id=${userData.profile_id}`;
                break;
            case 'failed':
                title = 'Subscription Suspended';
                message = 'Your subscription has been suspended. Please contact support.';
                actionText = 'Contact Support';
                actionLink = 'mailto:danikhalil2004@gmail.com';
                break;
            default:
                title = 'Subscription Required';
                message = 'You must activate a subscription plan to continue.';
                actionText = 'View Plans';
                actionLink = `/subscribe/123?profile_id=${userData.profile_id}`;
        }

        return { title, message, actionText, actionLink };
    };

    const subscriptionMessage = getSubscriptionMessage();

    if (subscriptionMessage) {
        const isSelf = id === profileId;
        console.log("ISSELF:", isSelf)
        console.log("USER", user?.profile_id)
        console.log("PROFILE", profileId)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
                    {subscriptionMessage.title}
                </Text>
                <Text style={{ fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' }}>
                    {subscriptionMessage.message}
                </Text>
                {isSelf && subscriptionMessage.actionText && (
                    <Button
                        text={subscriptionMessage.actionText}
                        onPress={() => {
                            if (subscriptionMessage.actionLink.startsWith('mailto:')) {
                                Linking.openURL(subscriptionMessage.actionLink);
                            } else {
                                router.push(subscriptionMessage.actionLink);
                            }
                        }}
                    />
                )}
            </View>
        );
    }

    // ----------------------
    // Loading / error / locked account
    // ----------------------
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#82C294" />
                <Text style={{ marginTop: 16 }}>[DEBUG] Loading user profile...</Text>
            </View>
        );
    }

    if (userData?.visibility === false && user?.role !== 'admin') {
        return <LockedAccountScreen />;
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

    // ----------------------
    // Helper functions
    // ----------------------
    const processContactLinks = () => {
        if (!userData) return [];
        const contactLinks = [];
        if (userData.email)
            contactLinks.push({ name: userData.email, iconName: 'email', link: userData.email });
        if (userData.phone_number)
            contactLinks.push({ name: userData.phone_number, iconName: 'phone', link: userData.phone_number });
        return contactLinks;
    };

    const normalizeUrl = (url: string) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return 'https://' + url;
    };

    const processConnectLinks = () => {
        if (!userData?.social_media_links) return [];
        return userData.social_media_links
            .map((link: any) => {
                try {
                    const rawUrl = link.url || link;
                    const url = normalizeUrl(rawUrl);
                    const hostname = new URL(url).hostname.replace('www.', '');
                    const icon = hostname.split('.')[0];
                    const username = url.split('/').filter(Boolean).pop();
                    return { id: link.id, iconName: icon, name: `@${username}`, link: url };
                } catch (error) {
                    console.error('Invalid URL:', link.url);
                    return null;
                }
            })
            .filter(Boolean);
    };

    const transformImageUrl = (url: string) => {
        if (!url) return url;
        return url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl);
    };

    return (
        <UserProfileComponent
            coverPhoto={transformImageUrl(userData.cover_photo_url)}
            profilePic={transformImageUrl(userData.profile_pic_url)}
            userName={userData.name}
            dob={userData.dob}
            headline={userData.headline}
            contactLinks={processContactLinks()}
            connectLinks={processConnectLinks()}
            websiteLink={userData.website_link}
            bio={userData.bio}
            videos={userData.videos_links}
            locations={userData.locations}
            followers={userData.followers}
            following={userData.following}
            id={Array.isArray(id) ? id[0] : id || 'User001'}
            profileId={userData.profile_id}
            customContent={userData.custom_content}
            fetchUserProfile={fetchUserProfile}
            QrCodeColor={userData.qr_code_color}
            includeProfilePic={userData.qr_code_include_profile_pic}
            includeContact={userData.qr_code_include_contact}
            includeSocialMedia={userData.qr_code_include_social}
            includeWebsite={userData.qr_code_include_website}
        />
    );
};

export default UserProfilePage;
