import React from 'react';
import {View, Text, ScrollView, StyleSheet, useWindowDimensions, } from 'react-native';
import YouTubePreview from '../YoutubePreview/YoutubePreview';

interface YouTubeObject {
  video_url: string;
  title?: string;
  description?: string;
}

interface YouTubeVideosProps {
  userName?: string;
  videos?: YouTubeObject[];
  gap?: number;
}

const YouTubeVideos = ({
    userName = "User",
    videos = [],
    gap = 16,
  }: YouTubeVideosProps) => {
    const { width: screenWidth } = useWindowDimensions();

    if (!videos || videos.length === 0) {
      return null;
    }

    const getCardWidth = () => {
      if (screenWidth < 480) return screenWidth * 0.85;
      if (screenWidth < 768) return 320;
      return 360;
    };

    const cardWidth = getCardWidth();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Videos
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: gap }
          ]}
          decelerationRate="fast"
          snapToInterval={cardWidth + gap}
          snapToAlignment="center"
        >
          {videos.map((video, index) => (
            <View
              key={index}
              style={[
                styles.videoCard,
                {
                  width: cardWidth,
                  marginRight: index === videos.length - 1 ? gap : 0
                }
              ]}
            >
              <YouTubePreview
                youtubeObject={video}
                width={cardWidth - 24}
                height={200}
              />
            </View>
          ))}
        </ScrollView>

        {videos.length > 1 && (
          <View style={styles.dotsContainer}>
            {videos.map((_, index) => (
              <View
                key={index}
                style={styles.dot}
              />
            ))}
          </View>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        paddingVertical: 16,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        lineHeight: 32,
    },
    userName: {
        color: '#82C294',
        fontWeight: '700',
    },
    scrollContent: {
        paddingVertical: 8,
        alignItems: 'center',
    },
    videoCard: {
        // padding: 12,
        marginHorizontal: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ddd',
    },
});

export default YouTubeVideos;