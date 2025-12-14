import NotificationsPage from '../../../src/components/UserProfile/Notifications/NotificationsPage';
import { useLocalSearchParams } from 'expo-router';

export default function ProfileAnalyticsScreen() {
    const { id } = useLocalSearchParams();
    
    return (
            <NotificationsPage id={id} />
    );
}