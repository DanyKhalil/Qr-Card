import React, { useState } from 'react';
import { View, Text,TextInput, TouchableOpacity, StyleSheet,  useWindowDimensions,Platform,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface LabelWithTextFieldProps {
    label: string;
    type?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'date';
    id?: string;
    value: string;
    setter: (value: string) => void;
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
        if (selectedDate) 
            setter(formatDate(selectedDate));
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
            
            {isDateType ? (
                <TouchableOpacity
                    style={[
                        styles.dateInput,
                        isColumnLayout && styles.columnInput,
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
                        multiline && styles.multilineInput
                    ]}
                    value={value}
                    onChangeText={setter}
                    placeholder={placeholder}
                    keyboardType={getKeyboardType()}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor="#999"
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    editable={!isDateType}
                />
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()} // maximum today no fututre
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#444',
        textAlign: 'left',
    },
    columnLabel: {
        width: '100%',
        marginBottom: 4,
    },
    multilineLabel: {
        alignSelf: 'flex-start',
    },
    input: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FF8559',
        borderRadius: 6,
        fontSize: 16,
        color: '#555',
        backgroundColor: '#fff',
        minWidth: 0,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderColor: '#FF8559',
        borderRadius: 6,
        backgroundColor: '#fff',
        minWidth: 0,
    },
    dateText: {
        fontSize: 16,
        color: '#555',
    },
    placeholderText: {
        color: '#999',
    },
    columnInput: {
        flex: 0,
        width: '100%',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default LabelWithTextField;