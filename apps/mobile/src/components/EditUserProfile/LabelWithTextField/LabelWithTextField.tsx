import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface LabelWithTextFieldProps {
    label: string;
    type?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'date';
    id?: string;
    value: string;
    setter?: (value: string) => void;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    errorMessage?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    multiline?: boolean;
}

const LabelWithTextField = ({
    label,
    type = 'default',
    id,
    value,
    setter,
    onChange,
    onBlur,
    errorMessage = '',
    placeholder = '',
    secureTextEntry = false,
    multiline = false,
}: LabelWithTextFieldProps) => {
    const { width: screenWidth } = useWindowDimensions();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isColumnLayout = screenWidth < 1250;
    const isDateType = type === 'date';

    const getKeyboardType = () => {
        switch (type) {
            case 'email-address': return 'email-address';
            case 'numeric': return 'numeric';
            case 'phone-pad': return 'phone-pad';
            default: return 'default';
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate && onChange) {
            onChange(formatDate(selectedDate));
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const getDisplayValue = () => {
        if (isDateType && value) {
            const date = new Date(value);
            return date.toLocaleDateString();
        }
        return value;
    };

    const handleTextChange = (text: string) => {
        if (onChange) {
            onChange(text);
        }
    };

    const handleInputBlur = () => {
        if (onBlur) {
            onBlur();
        }
    };

    return (
        <View style={[
            styles.container,
            isColumnLayout && styles.columnContainer,
            multiline && styles.multilineContainer
        ]}>
            <Text style={[
                styles.label,
                isColumnLayout && styles.columnLabel,
                multiline && styles.multilineLabel
            ]}>
                {label}
            </Text>
            
            <View style={[
                styles.inputContainer,
                multiline && styles.multilineInputContainer
            ]}>
                {isDateType ? (
                    <TouchableOpacity
                        style={[
                            styles.dateInput,
                            isColumnLayout && styles.columnInput,
                            errorMessage ? styles.inputError : null
                        ]}
                        onPress={showDatePickerModal}
                    >
                        <Text style={[
                            styles.dateText,
                            !value && styles.placeholderText
                        ]}>
                            {getDisplayValue() || placeholder || 'Select date'}
                        </Text>
                        <Ionicons name="calendar" size={20} color="#FF8559" />
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        style={[
                            styles.input,
                            isColumnLayout && styles.columnInput,
                            multiline && styles.multilineInput,
                            errorMessage ? styles.inputError : null
                        ]}
                        value={value}
                        onChangeText={handleTextChange}
                        onBlur={handleInputBlur}
                        placeholder={placeholder}
                        keyboardType={getKeyboardType()}
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor="#999"
                        multiline={multiline}
                        numberOfLines={multiline ? 4 : 1}
                        textAlignVertical={multiline ? 'top' : 'center'}
                    />
                )}

                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {errorMessage || ' '}
                    </Text>
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 4,
        marginVertical: 4,
    },
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    multilineContainer: {
        alignItems: 'flex-start',
    },
    label: {
        flex: 0,
        width: 100,
        fontSize: 14,
        fontWeight: '500',
        color: '#2E2B5F', // dark indigo
        textAlign: 'left',
        marginTop: 12,
    },
    columnLabel: {
        width: '100%',
        marginBottom: 4,
        marginTop: 0,
    },
    multilineLabel: {
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flex: 1,
        minWidth: 0,
        maxWidth: '100%',
    },
    multilineInputContainer: {
        alignSelf: 'stretch',
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#6C63FF', // indigo border
        borderRadius: 6,
        fontSize: 16,
        color: '#2E2B5F', // dark indigo text
        backgroundColor: '#F5F4FF', // light lavender background
        width: '100%',
        maxWidth: '100%',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderColor: '#6C63FF', // indigo border
        borderRadius: 6,
        backgroundColor: '#F5F4FF', // light lavender background
        width: '100%',
        maxWidth: '100%',
    },
    dateText: {
        fontSize: 16,
        color: '#2E2B5F', // dark indigo text
        flex: 1,
    },
    placeholderText: {
        color: '#9A8CFF', // lighter lavender placeholder
    },
    columnInput: {
        width: '100%',
        maxWidth: '100%',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
        minHeight: 100,
        maxHeight: 200,
        textAlign: 'left',
        alignSelf: 'stretch',
    },
    inputError: {
        borderColor: '#9A6CFF', // soft lavender-red for error
    },
    errorContainer: {
        minHeight: 20,
        justifyContent: 'center',
        width: '100%',
    },
    errorText: {
        color: '#9A6CFF', // soft lavender-red for error text
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        marginTop: 2,
    },
});

export default LabelWithTextField;