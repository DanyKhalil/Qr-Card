import React, { useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';

interface AnimatedButtonProps extends ButtonProps {
  scaleTo?: number;
}

const AnimatedButton = ({
  text = "Click Me",
  bold = false,
  color = "coral",
  onPress = () => {},
  width = 220,
  disabled = false,
  scaleTo = 0.97,
  style,
  textStyle,
}: AnimatedButtonProps) => {
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      width: width,
      opacity: disabled ? 0.6 : 1,
    };

    if (color === 'coral') {
      return {
        ...baseStyle,
        backgroundColor: disabled ? '#CCCCCC' : '#FF8559',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: disabled ? '#CCCCCC' : '#82C294',
      };
    }
  };

  const getTextColor = () => {
    return disabled ? '#666666' : '#FFFFFF';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <AnimatedTouchable
        style={[
          styles.button,
          getButtonStyle(),
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text style={[
          styles.text,
          bold && styles.boldText,
          { color: getTextColor() },
          textStyle,
        ]}>
          {text}
        </Text>
      </AnimatedTouchable>
    </Animated.View>
  );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 56,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default AnimatedButton;