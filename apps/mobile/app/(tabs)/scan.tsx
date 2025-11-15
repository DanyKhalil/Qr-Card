import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ScanTab() {
    const handleScan = () => {
        const scannedUserId = '123';
        router.push(`/(stack)/user-profile/${scannedUserId}`);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Scan QR Code</Text>
            
            <View style={{
                width: 250,
                height: 250,
                borderWidth: 2,
                borderColor: '#007AFF',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30,
            }}>
                <Text style={{ color: '#666', textAlign: 'center' }}>
                    QR Scanner Preview{'\n'}(Camera would be here)
                </Text>
            </View>

            <Pressable
                onPress={handleScan}
                style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 30,
                    paddingVertical: 15,
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Scan QR Code</Text>
            </Pressable>

            <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>
                Scan a user's QR code to visit their profile
            </Text>
        </View>
    );
}