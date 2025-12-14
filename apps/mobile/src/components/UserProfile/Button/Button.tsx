import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface ButtonProps {
    text?: string;
    bold?: boolean;
    color?: 'coral' | 'green';
    onPress?: () => void;
    width?: number | string;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button = ({
    text = "Click Me",
    bold = false,
    color = "coral",
    onPress = () => {},
    width = 220,
    disabled = false,
    style,
    textStyle,
}: ButtonProps) => {
  
    const getButtonStyle = () => {
        const baseStyle: ViewStyle = {
            width: width,
            opacity: disabled ? 0.6 : 1,
        };

        if (color === 'coral') {
            return {
                ...baseStyle,
                backgroundColor: disabled ? '#CCCCCC' : '#E3E0F3', // Soft Lavender
            };
        } else {
            return {
                ...baseStyle,
                backgroundColor: disabled ? '#CCCCCC' : '#547DAD', // Muted Indigo Blue
            };
        }
    };

    const getTextColor = () => {
        // Use darker text on secondary for readability
        if (disabled) return '#666666';
        return color === 'coral' ? '#547DAD' : '#FFFFFF';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >

            <Text style={[
                styles.text,
                bold && styles.boldText,
                { color: getTextColor() },
                textStyle,
            ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 50,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default Button;
