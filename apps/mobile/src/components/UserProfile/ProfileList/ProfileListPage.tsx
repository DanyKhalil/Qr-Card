import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native";
import ProfileList from "./ProfileList";
import { useRoute } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfileListPage = ({title, profiles}) => {
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.pageTitle}>{title}</Text>
          
          {profiles.length > 0 ? (
            <View style={styles.profileListWrapper}>
              <ProfileList profiles={profiles} />
            </View>
          ) : (
            <View style={styles.noProfiles}>
              <Text style={styles.noProfilesText}>
                No {title.toLowerCase()} yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
    width: SCREEN_WIDTH,
  },
  scrollView: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    width: SCREEN_WIDTH,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 24,
    textAlign: "center",
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  profileListWrapper: {
    width: SCREEN_WIDTH,
  },
  noProfiles: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: SCREEN_WIDTH,
  },
  noProfilesText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
});

export default ProfileListPage;