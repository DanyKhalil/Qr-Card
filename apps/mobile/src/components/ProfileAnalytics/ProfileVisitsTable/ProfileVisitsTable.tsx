import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DEVELOPMENT_CONFIG } from '../../../config/development';


const ProfileVisitsTable = ({ visits, dateRange }) => {
  const router = useRouter();
  const { width } = Dimensions.get('window');

  const transformImageUrl = (url: string) => {
      if (!url) 
          return url;
      let transformedUrl = url.replace('http://localhost:5050', DEVELOPMENT_CONFIG.backendBaseUrl)
      return transformedUrl;
  };

  const formatVisitTime = (dateString) => {
    const visitDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - visitDate;
    const diffMinutes = diffMs / (1000 * 60);
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffMinutes < 60) {
      return 'Less than an hour ago';
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      const days = Math.floor(diffDays);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return visitDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'today':
        return 'Today';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case 'year':
        return 'Last Year';
      default:
        return 'Recent';
    }
  };

  const handleProfileClick = (userId) => {
    router.push(`/user-profile/${userId}`);
  };

  if (!visits || visits.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Visitors - {getDateRangeText()}</Text>
        <View style={styles.noVisits}>
          <Text style={styles.noVisitsText}>
            No profile visits in {getDateRangeText().toLowerCase()}
          </Text>
        </View>
      </View>
    );
  }

  // Responsive styles based on screen width
  const responsiveStyles = getResponsiveStyles(width);

  return (
    <View style={[styles.container, responsiveStyles.container]}>
      <View style={styles.tableHeader}>
        <Text style={styles.title}>Visitors - {getDateRangeText()}</Text>
        <View style={styles.visitsCount}>
          <Text style={styles.visitsCountText}>{visits.length} visits</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.visitsContainer}
        showsVerticalScrollIndicator={false}
      >
        {visits.map((visit) => (
          <TouchableOpacity 
            key={visit.id} 
            style={[styles.visitCard, responsiveStyles.visitCard]}
            onPress={() => visit.visitor && handleProfileClick(visit.visitor.profile_id)}
          >
            {visit.visitor ? (
              <View style={[styles.visitorInfo, responsiveStyles.visitorInfo]}>
                {visit.visitor.profile_pic_url != null ? (
                    <Image 
                      source={{ uri: transformImageUrl(visit.visitor.profile_pic_url) }} 
                      style={[styles.visitorAvatar, responsiveStyles.visitorAvatar]}
                      defaultSource={require('./avatar-default.svg')}
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                 ) : (
                  <View style={[styles.anonymousAvatar, responsiveStyles.anonymousAvatar]}>
                    <Ionicons name="person-outline" size={20} color="#718096" />
                  </View>
                )}
                <View style={[styles.visitorDetails, responsiveStyles.visitorDetails]}>
                  <Text style={styles.visitorName} numberOfLines={1}>
                    {visit.visitor.name}
                  </Text>
                  <Text style={styles.visitTime}>
                    {formatVisitTime(visit.visit_date_time)}
                  </Text>
                  {visit.qr_scan && (
                    <View style={styles.qrBadge}>
                      <Text style={styles.qrBadgeText}>QR Scan</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={[styles.anonymousVisit, responsiveStyles.anonymousVisit]}>
                <View style={[styles.anonymousAvatar, responsiveStyles.anonymousAvatar]}>
                  <Ionicons name="person-outline" size={20} color="#718096" />
                </View>
                <View style={[styles.visitorDetails, responsiveStyles.visitorDetails]}>
                  <Text style={styles.visitorName}>Anonymous Visitor</Text>
                  <Text style={styles.visitTime}>
                    {formatVisitTime(visit.visit_date_time)}
                  </Text>
                  {visit.qr_scan && (
                    <View style={styles.qrBadge}>
                      <Text style={styles.qrBadgeText}>QR Scan</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getResponsiveStyles = (width: number) => {
  const responsiveStyles: any = {};

  if (width >= 1200) {
    responsiveStyles.container = { maxWidth: 900 };
    responsiveStyles.visitCard = { padding: 20 };
  }

  if (width <= 768) {
    responsiveStyles.container = {
      padding: 16,
      marginTop: 20,
      maxWidth: '100%'
    };
    responsiveStyles.visitCard = {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    };
    responsiveStyles.visitorInfo = {
      width: '100%',
    };
  }

  if (width <= 480) {
    responsiveStyles.visitorInfo = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    };
    responsiveStyles.visitorDetails = {
      marginLeft: 0,
    };
    responsiveStyles.visitorName = { textAlign: 'center' };
    responsiveStyles.visitTime = { textAlign: 'center' };
  }

  if (width <= 360) {
    responsiveStyles.container = { padding: 12 };
    responsiveStyles.visitCard = { padding: 12 };
    responsiveStyles.visitorAvatar = { width: 40, height: 40 };
    responsiveStyles.anonymousAvatar = { width: 40, height: 40 };
  }

  return responsiveStyles;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
    margin: 10,
    marginTop: 30,
    maxWidth: 1000,
    width: Dimensions.get('window').width - 20,
    alignSelf: 'center',
    backgroundColor: '#F5F3FF', // soft lavender background
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B4C7A', // muted indigo
    margin: 0,
  },
  visitsCount: {
    backgroundColor: '#E0DBF7', // soft lavender variant
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  visitsCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B4C7A', // muted indigo
  },
  visitsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  visitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D2C9F0', // soft lavender border
    borderRadius: 8,
    maxWidth: '100%',
    backgroundColor: '#FFFFFF', // keep card white
  },
  visitorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  visitorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EDE9FE', // lavender border
  },
  anonymousAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDE9FE', // soft lavender
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D2C9F0', // lavender border
  },
  visitorDetails: {
    paddingLeft: 10,
    minWidth: 0,
    marginLeft: 12,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B4C7A', // muted indigo
    marginBottom: 4,
  },
  visitTime: {
    fontSize: 14,
    color: '#6B6C8A', // muted indigo lighter
    marginBottom: 4,
  },
  qrBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE', // soft lavender
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  qrBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B4C7A', // muted indigo
  },
  anonymousVisit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  noVisits: {
    alignItems: 'center',
    padding: 40,
  },
  noVisitsText: {
    fontSize: 16,
    color: '#6B6C8A', // muted indigo lighter
    textAlign: 'center',
  },
});


export default ProfileVisitsTable;