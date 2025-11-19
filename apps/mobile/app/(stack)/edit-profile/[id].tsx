import EditUserProfilePage from '@/src/pages/EditUserProfile';
import { useLocalSearchParams } from 'expo-router';

export default function EditProfileScreen() {
    const { id } = useLocalSearchParams();
    
    return (
        <EditUserProfilePage/>
    );
}