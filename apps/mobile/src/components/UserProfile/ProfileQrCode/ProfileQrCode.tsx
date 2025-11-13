import React, { useRef } from 'react';
import { View, Text, StyleSheet,useWindowDimensions,Alert,} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '../Button/Button';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

interface ProfileQrCodeProps {
    profileUrl: string;
}

const ProfileQrCode = ({ id }: { id: string }) => {
    const expoUrl = `exp://192.168.0.102:8081/--/(stack)/user-profile/${id}`;
    // const webUrl = `http://192.168.1.100:8081/user-profile/${id}`;

    const { width: screenWidth } = useWindowDimensions();
    const qrRef = useRef(null);

    if (!expoUrl) return null;

    const qrSize = screenWidth * 0.6;

    const handleDownload = async () => {
        try {
            // to request permission to download
            const { status } = await MediaLibrary.requestPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to save the QR code.');
                return;
            }

            // this take a photo of qr code
            const uri = await captureRef(qrRef, {
                format: 'png',
                quality: 1.0,
            });
            // and save it to gallery
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Success', 'QR code saved to your gallery!');
        } catch (error) {
            console.error('Error saving QR code:', error);
            Alert.alert('Error', 'Failed to save QR code');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Share Profile</Text>
            
            <View ref={qrRef} style={styles.qrContainer}>
                <QRCode
                value={expoUrl}
                size={qrSize}
                backgroundColor="#ffffff"
                color="#0a0a0a"
                />
            </View>

            <Button
                text="Download QR Code"
                color="green"
                bold
                onPress={handleDownload}
                width={qrSize}
                style={{ marginTop: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        marginTop: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default ProfileQrCode;