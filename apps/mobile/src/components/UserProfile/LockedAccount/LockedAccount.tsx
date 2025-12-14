import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const LockedAccountScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:danikhalil2004@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.contentCard}>
            {/* Lock Icon */}
            <View style={styles.iconContainer}>
              <Lock size={80} color="#6c757d" opacity={0.8} />
            </View>

            {/* Title */}
            <Text style={styles.title}>Account Locked</Text>

            {/* Main Message */}
            <Text style={styles.message}>
              This account has been temporarily locked due to a violation of our community guidelines.
            </Text>

            {/* Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>
                The user's profile is currently unavailable for viewing. This action was taken to 
                ensure a safe and respectful environment for all members of our community.
              </Text>
              
              <View style={styles.contactContainer}>
                <Text style={styles.contactText}>
                  If you believe this is a mistake or have any questions, please contact our{' '}
                  <Text 
                    style={styles.supportLink}
                    onPress={handleContactSupport}
                  >
                    support team
                  </Text>
                  .
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGoBack}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Return Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 20, // Adjust for header
  },
  contentCard: {
    width: Math.min(width - 40, 600),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'System',
    }),
  },
  message: {
    fontSize: 18,
    color: '#dc3545',
    fontWeight: '500',
    marginBottom: 32,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'System',
    }),
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    width: '100%',
  },
  detailsText: {
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'System',
    }),
  },
  contactContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
    paddingLeft: 16,
    marginTop: 16,
  },
  contactText: {
    color: '#6c757d',
    lineHeight: 22,
    fontStyle: 'italic',
    fontSize: 14,
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'System',
    }),
  },
  supportLink: {
    color: '#007bff',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'System',
    }),
  },
  // For hover effects - we can simulate with pressed state
  buttonPressed: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
});

// If you want to add gradient background:
// 1. Install: npm install react-native-linear-gradient
// 2. Import: import LinearGradient from 'react-native-linear-gradient';
// 3. Replace container with:
/*
<LinearGradient
  colors={['#f8f9fa', '#e9ecef']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 1}}
  style={styles.container}
>
  ... rest of the content
</LinearGradient>
*/

export default LockedAccountScreen;