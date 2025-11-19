// import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {View,Text,  ActivityIndicator,  Alert,ScrollView, Platform, PermissionsAndroid } from 'react-native';
import {useFocusEffect, useLocalSearchParams } from 'expo-router';
import UserProfileComponent from '../components/UserProfile/UserProfile';
import { userApi } from '../services/userApi';
import { profileAnalyticsApi} from '../services/profileAnalyticsApi';
import Button from '../components/UserProfile/Button/Button';
import { DEVELOPMENT_CONFIG } from '../config/development';
// import * as Contacts from "expo-contacts";
import Contacts from 'react-native-contacts'



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



    // // function to save contacts:
    // async function saveContact({ name, phone, email }) {
    //     const { status } = await Contacts.requestPermissionsAsync();

    //     if (status !== "granted") {
    //         Alert.alert("Permission denied", "Cannot save contact without permission.");
    //         return;
    //     }

    //     const contact: any = {
    //         [Contacts.Fields.FirstName]: name || "",
    //         [Contacts.Fields.PhoneNumbers]: phone ? [{ number: phone }] : [],
    //         [Contacts.Fields.Emails]: email ? [{ email }] : [],
    //         ...(Platform.OS === 'android' 
    //             ? { accountType: 'com.android.localphone', accountName: 'Phone' } 
    //             : {}),
    //         };

    //     try {
    //         const contactId = await Contacts.addContactAsync(contact);
    //         console.log("Saved contact ID:", contactId);

    //         if (contactId) {
    //             Alert.alert("Success", "Contact saved to your phone.");
    //         }
    //     } catch (err) {
    //         console.error("CONTACT ERROR:", err);
    //         Alert.alert("Error", "Failed to save contact.");
    //     }
    // }
    // function to save contacts:
    // async function saveContact({ name, phone, email }) {
    //     let contactObject =  {
    //         displayName: name,
    //         phoneNumbers: [phone,],
    //         emailAddresses: [email,],
    //     }

    //     try {
    //         await Contacts.addContact(contactObject)
    //         console.log('added contact')
    //     } catch (err) {
    //         console.error("CONTACT ERROR:", err);
    //         Alert.alert("Error", "Failed to save contact.");
    //     }
    // }

// async function saveContact({ nameInput, phoneInput, emailInput }) {
//     try {
//         console.log('Starting contact save...');
//         console.log('Received parameters:', { nameInput, phoneInput, emailInput });

//         // Validate input parameters
//         if (!nameInput || !phoneInput) {
//             Alert.alert('Invalid Data', 'Name and phone number are required to save a contact.');
//             return;
//         }

//         // Clean and validate data
//         const cleanName = (nameInput || '').trim();
//         const cleanPhone = (phoneInput || '').toString().trim();
//         const cleanEmail = (emailInput || '').trim();

//         if (!cleanName) {
//             Alert.alert('Invalid Name', 'Please provide a valid name.');
//             return;
//         }

//         if (!cleanPhone) {
//             Alert.alert('Invalid Phone', 'Please provide a valid phone number.');
//             return;
//         }

//         console.log('Cleaned contact data:', { 
//             name: cleanName, 
//             phone: cleanPhone, 
//             email: cleanEmail 
//         });

//         // Request permission first
//         let permissionGranted = false;
        
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
//                 {
//                     title: 'Contacts Permission',
//                     message: 'This app needs access to your contacts to save contact information.',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 }
//             );
//             permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
//         } else {
//             // For iOS, use the library's permission method
//             permissionGranted = await Contacts.requestPermission();
//         }

//         if (!permissionGranted) {
//             Alert.alert('Permission Denied', 'Cannot save contact without permission.');
//             return;
//         }

//         // Build contact object with only valid data
//         const contactObject = {
//             givenName: cleanName,
//             phoneNumbers: [{
//                 label: 'mobile',
//                 number: cleanPhone,
//             }],
//         };

//         // Only add email if provided and valid
//         if (cleanEmail && cleanEmail.includes('@')) {
//             contactObject.emailAddresses = [{
//                 label: 'work', 
//                 email: cleanEmail,
//             }];
//         }

//         console.log('Final contact object to save:', contactObject);

//         // Save contact
//         await Contacts.addContact(contactObject);
//         console.log('Contact added successfully');
//         Alert.alert('Success', 'Contact saved to your device!');
        
//     } catch (err) {
//         console.error("CONTACT ERROR:", err);
//         console.error("Error details:", err);
//         Alert.alert("Error", "Failed to save contact: " + (err.message || 'Unknown error'));
//     }
// }


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
            // saveContactFunction={saveContact}
            // phoneNumber={userData.phone_number[0]}
            // email={userData.email[0]}
        />
    );
};

export default UserProfilePage;