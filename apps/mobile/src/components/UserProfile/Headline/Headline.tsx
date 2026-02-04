import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import FollowButton from '../FollowButton/FollowButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface HeadlineProps {
    name: string;
    dob?: string;
    headline?: string;
}

const Headline = ({ 
        id,
        profileId,
        name, 
        dob, 
        headline,
        followers = [],
        following = [],
        onProfileRefresh, // callback to refresh profile data
        fetchUserProfile,
    }: HeadlineProps) => {

        const getLoggedInUserId = async () => {
            try {
                const loggedInUserString = await AsyncStorage.getItem("user");
                if (loggedInUserString) {
                    const loggedInUser = JSON.parse(loggedInUserString);
                    return loggedInUser.id || null;
                }
                return null;
            } catch (error) {
                console.error("Error getting user ID:", error);
                return null;
            }
        }
        const getCurrentUserProfileId = async () => {
            try {
                const profileId = await AsyncStorage.getItem("profileId");
                return profileId;
            } catch (error) {
                console.error("Error getting profile ID:", error);
                return null;
            }
        }

        const [loggedInUserId, setLoggedInUserId] = useState(null);
        const [loggedInUserProfileId, setLoggedInUserProfileId] = useState(null);

        useEffect(() => {
            const fetchUserId = async () => {
                const userId = await getLoggedInUserId();
                const profileId = await getCurrentUserProfileId();
                setLoggedInUserId(userId);
                setLoggedInUserProfileId(profileId);
            };
            
            fetchUserId();
        }, []);


        const onFollowersPress = () => {
            router.push({
                pathname: '/(stack)/followers/[id]',
                params: { 
                id: id,
                type: 'followers',
                profiles: JSON.stringify(followers)
                }
            });
        };

        const onFollowingPress = () => {
            router.push({
                pathname: '/(stack)/following/[id]',
                params: { 
                id: id,
                type: 'following',
                profiles: JSON.stringify(following)
                }
            });
        };




        const { width: screenWidth } = useWindowDimensions();

        const calculateAge = (birthDate: string) => {
            if (!birthDate) return null;
    
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
            }

            return age;
        };

        const age = dob ? calculateAge(dob) : null;

        const getNameFontSize = () => {
            if (screenWidth < 380) return 28;
            if (screenWidth < 480) return 32;
            return 36;
        };

        const getAgeFontSize = () => {
            if (screenWidth < 380) return 14;
            if (screenWidth < 480) return 16;
            return 18;
        };

        const getHeadlineFontSize = () => {
            if (screenWidth < 380) return 14;
            if (screenWidth < 480) return 15;
            return 16;
        };

        return (
            <View style={styles.container}>
                <View style={styles.nameAgeContainer}>
                    <Text style={[
                    styles.name,
                    { fontSize: getNameFontSize() }
                    ]}>
                    {name}
                    </Text>
                    
                    {age !== null && (
                    <Text style={[
                        styles.age,
                        { fontSize: getAgeFontSize() }
                    ]}>
                        {age} years old
                    </Text>
                    )}
                </View>
                
                <Text style={[
                    styles.headline,
                    { fontSize: getHeadlineFontSize() }
                ]}>
                    {headline}
                </Text>

                <View style={styles.statsContainer}>
                    <TouchableOpacity 
                        style={styles.statItem} 
                        onPress={onFollowersPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.statNumber}>{followers.length}</Text>
                        <Text style={[styles.statLabel, styles.followersLabel]}>
                        {followers.length === 1 ? 'Follower' : 'Followers'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity 
                        style={styles.statItem} 
                        onPress={onFollowingPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.statNumber}>{following.length}</Text>
                        <Text style={[styles.statLabel, styles.followingLabel]}>
                        Following
                        </Text>
                    </TouchableOpacity>
                </View>


                {loggedInUserProfileId && loggedInUserProfileId !== profileId && (
                    <FollowButton
                        currentUserId={loggedInUserId}
                        currentProfileId={loggedInUserProfileId}
                        profileId={profileId}
                        followers={followers}
                        following={following}
                        onFollowUpdate={onProfileRefresh}
                        fetchUserProfile={fetchUserProfile}
                    />
                )}
            </View>
        );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: -10,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 12,
  },
  name: {
    fontWeight: '700',
    color: '#222225ff', // muted indigo
    lineHeight: 36,
  },
  age: {
    color: '#BFA5FF', // soft lavender
    fontWeight: '600',
    lineHeight: 20,
  },
  headline: {
    color: '#151516ff', // medium lavender
    lineHeight: 20,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B3FDD', // muted indigo
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  followersLabel: {
    color: '#BFA5FF', // soft lavender
  },
  followingLabel: {
    color: '#9C8DFF', // medium lavender
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: '#D3CFFF', // very soft lavender separator
    marginHorizontal: 20,
  },
});


export default Headline;