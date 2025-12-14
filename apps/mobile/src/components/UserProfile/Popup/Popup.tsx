import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from 'react-native';
import { X, ArrowRight, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const PopupComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Check if user already closed it before
    const wasClosed = false;
    
    if (!wasClosed) {
      const timer = setTimeout(() => {
        showPopup();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showPopup = () => {
    setIsVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handleClose = async () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  const handleJoinClick = () => {
    handleClose();
    router.replace("/(auth)/login")
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacity,
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          <View style={styles.card}>
            {/* Decorative top accent */}
            <View style={styles.accent} />

            <View style={styles.content}>
              {/* Header with close button */}
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <View style={styles.iconContainer}>
                    <Sparkles size={20} color="#3B4A99" />
                  </View>
                  <Text style={styles.title}>Join Our Community</Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.body}>
                <Text style={styles.description}>
                  Create your personalized profile and unlock premium features for your first month - completely free. No credit card required.
                </Text>

                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureDot, styles.dotBlue]} />
                    <Text style={styles.featureText}>Customizable profile</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureDot, styles.dotPurple]} />
                    <Text style={styles.featureText}>Easy sharing</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureDot, styles.dotPink]} />
                    <Text style={styles.featureText}>Advanced analytics</Text>
                  </View>
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                onPress={handleJoinClick}
                style={styles.ctaButton}
                activeOpacity={0.9}
              >
                <Text style={styles.ctaText}>Start Free Month</Text>
                <ArrowRight size={16} color="white" />
              </TouchableOpacity>

              {/* Footer note */}
              <Text style={styles.footerNote}>
                No commitment - Cancel anytime
              </Text>
            </View>
          </View>

          {/* Decorative floating elements - Fixed positioning */}
          <View style={[styles.decorativeElement, styles.decor1]} />
          <View style={[styles.decorativeElement, styles.decor2]} />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  container: {
    width: Math.min(width - 48, 384),
    alignSelf: 'center',
    marginVertical: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 244, 246, 1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  accent: {
    height: 4,
    backgroundColor: '#3B4A99', // Solid color fallback for gradient
    width: '100%',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: 'rgba(219, 234, 254, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Roboto',
      default: 'System',
    }),
    fontWeight: '600',
    color: 'rgba(17, 24, 39, 1)',
    letterSpacing: -0.025,
    marginLeft: 12,
    flexShrink: 1,
  },
  closeButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  body: {
    marginBottom: 24,
  },
  description: {
    color: 'rgba(75, 85, 99, 1)',
    lineHeight: 22,
    marginBottom: 20,
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Roboto',
      default: 'System',
    }),
  },
  featuresList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dotBlue: {
    backgroundColor: 'rgba(59, 74, 153, 1)',
  },
  dotPurple: {
    backgroundColor: 'rgba(58, 175, 169, 1)',
  },
  dotPink: {
    backgroundColor: 'rgba(75, 85, 99, 1)',
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(55, 65, 81, 1)',
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Roboto',
      default: 'System',
    }),
    flex: 1,
  },
  ctaButton: {
    backgroundColor: '#3B4A99', // Solid color fallback for gradient
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B4A99',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 4,
  },
  ctaText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Roboto',
      default: 'System',
    }),
    marginRight: 8,
  },
  footerNote: {
    fontSize: 12,
    color: 'rgba(156, 163, 175, 1)',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Roboto',
      default: 'System',
    }),
  },
  decorativeElement: {
    position: 'absolute',
    borderRadius: 50,
  },
  decor1: {
    top: -10,
    left: -10,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(59, 74, 153, 0.1)',
    zIndex: -1,
  },
  decor2: {
    bottom: -12,
    right: -12,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(58, 175, 169, 0.1)',
    zIndex: -1,
  },
});

// If you want gradients, install and use react-native-linear-gradient:
// npm install react-native-linear-gradient

// Then replace the accent and button with:
/*
import LinearGradient from 'react-native-linear-gradient';

// In accent:
<LinearGradient
  colors={['#3B4A99', '#3AAFA9', '#4B5563']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.accent}
/>

// In ctaButton:
<LinearGradient
  colors={['#3B4A99', '#3AAFA9']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 0}}
  style={styles.ctaButton}
>
  <Text style={styles.ctaText}>Start Free Month</Text>
  <ArrowRight size={16} color="white" />
</LinearGradient>
*/

export default PopupComponent;