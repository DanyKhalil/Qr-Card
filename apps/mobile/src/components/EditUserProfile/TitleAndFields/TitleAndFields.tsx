import React from 'react';
import {  View, Text, StyleSheet, useWindowDimensions,} from 'react-native';
import LabelWithTextField from '../LabelWithTextField/LabelWithTextField';

interface TitleAndFieldsProps {
    title: string;
    fields?: any[];
}

const TitleAndFields = ({ title, fields = [] }: TitleAndFieldsProps) => {
    const { width: screenWidth } = useWindowDimensions();

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return null;
    }

    // for different sizes
    const getTitleFontSize = () => {
        if (screenWidth < 480) return 20;
        if (screenWidth < 768) return 22;
        return 24;
    };

    return (
        <View style={[
            styles.container,
            { paddingHorizontal: screenWidth < 480 ? 15 : 20 }
        ]}>
            <Text style={[styles.title, { fontSize: getTitleFontSize() }]}>
                {title}
            </Text>
        
            <View style={styles.fieldsContainer}>
                {fields.map((field, index) => (
                    <LabelWithTextField
                        key={index}
                        label={field.label}
                        type={field.type}
                        id={field.id}
                        value={field.value}
                        setter={field.setter}
                        onChange={field.onChange}
                        errorMessage={field.errorMessage}
                        onBlur={field.onBlur}
                        placeholder={field.placeholder}
                        secureTextEntry={field.secureTextEntry}
                        multiline={field.multiline}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        marginBottom: 20,
    },
    title: {
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'left',
    },
    fieldsContainer: {
        gap: 14,
        width: '100%',
    },
});

export default TitleAndFields;