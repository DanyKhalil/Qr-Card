import ProfileAnalytics from '@/src/components/ProfileAnalytics/ProfileAnalytics';
import ProfileAnalyticsPage from '@/src/pages/ProfileAnalytics';
import { useLocalSearchParams } from 'expo-router';

export default function ProfileAnalyticsScreen() {
    const { id } = useLocalSearchParams();
    
    return (
            <ProfileAnalyticsPage id={id} />
    );
}