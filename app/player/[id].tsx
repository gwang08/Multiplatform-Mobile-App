import { LoadingComponent } from '@/components/LoadingComponent';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { favoritesService } from '@/services/favoritesService';
import { playerService } from '@/services/playerService';
import { Feedback, Player } from '@/types/Player';
import {
    calculateAge,
    formatMinutesToHours,
    formatPassingAccuracy,
    getRatingStars,
    groupFeedbacksByRating
} from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedRating, setExpandedRating] = useState<number | null>(null);
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (id) {
      loadPlayerData();
    }
  }, [id]);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      const [playerData, favoriteStatus] = await Promise.all([
        playerService.getPlayerById(id!),
        favoritesService.isFavorite(id!)
      ]);
      
      if (playerData) {
        setPlayer(playerData);
        setIsFavorite(favoriteStatus);
      } else {
        Alert.alert('Error', 'Player not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load player data');
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!player) return;

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(player.id);
        setIsFavorite(false);
        Alert.alert('Removed', `${player.playerName} removed from favorites`);
      } else {
        await favoritesService.addToFavorites(player);
        setIsFavorite(true);
        Alert.alert('Added', `${player.playerName} added to favorites`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const renderStatCard = (label: string, value: string, icon: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.background, borderColor: theme.icon }]}>
      <Ionicons name={icon as any} size={24} color={theme.tint} />
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.icon }]}>{label}</Text>
    </View>
  );

  const renderFeedbacksByRating = () => {
    if (!player?.feedbacks || player.feedbacks.length === 0) {
      return (
        <Text style={[styles.noFeedback, { color: theme.icon }]}>
          No feedback available for this player
        </Text>
      );
    }

    const groupedFeedbacks = groupFeedbacksByRating(player.feedbacks);
    const averageRating = player.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / player.feedbacks.length;

    return (
      <View style={styles.feedbackSection}>
        <View style={styles.ratingOverview}>
          <Text style={[styles.averageRating, { color: theme.text }]}>
            {averageRating.toFixed(1)}
          </Text>
          <Text style={[styles.ratingStars, { color: '#f1c40f' }]}>
            {getRatingStars(Math.round(averageRating))}
          </Text>
          <Text style={[styles.totalReviews, { color: theme.icon }]}>
            {player.feedbacks.length} review{player.feedbacks.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {groupedFeedbacks.map(({ rating, count, feedbacks }) => (
          <View key={rating} style={styles.ratingGroup}>
            <Pressable
              style={[styles.ratingHeader, { borderColor: theme.icon }]}
              onPress={() => setExpandedRating(expandedRating === rating ? null : rating)}
            >
              <View style={styles.ratingInfo}>
                <Text style={[styles.ratingText, { color: '#f1c40f' }]}>
                  {getRatingStars(rating)}
                </Text>
                <Text style={[styles.ratingCount, { color: theme.text }]}>
                  {count} review{count !== 1 ? 's' : ''}
                </Text>
              </View>
              <Ionicons
                name={expandedRating === rating ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.icon}
              />
            </Pressable>

            {expandedRating === rating && (
              <View style={styles.feedbackList}>
                {feedbacks.map((feedback: Feedback, index: number) => (
                  <View
                    key={index}
                    style={[styles.feedbackItem, { backgroundColor: theme.background, borderColor: theme.icon }]}
                  >
                    <Text style={[styles.feedbackComment, { color: theme.text }]}>
                      "{feedback.comment}"
                    </Text>
                    <View style={styles.feedbackMeta}>
                      <Text style={[styles.feedbackAuthor, { color: theme.icon }]}>
                        - {feedback.author}
                      </Text>
                      <Text style={[styles.feedbackDate, { color: theme.icon }]}>
                        {new Date(feedback.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return <LoadingComponent message="Loading player details..." />;
  }

  if (!player) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.text }]}>Player not found</Text>
      </View>
    );
  }

  const playerAge = calculateAge(player.YoB);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: player.image }} 
            style={styles.playerImage}
            contentFit="cover"
          />
          <View style={styles.playerInfo}>
            <Text style={[styles.playerName, { color: theme.text }]}>
              {player.playerName}
            </Text>
            <Text style={[styles.playerTeam, { color: theme.tint }]}>
              {player.team}
            </Text>
            <View style={styles.basicInfo}>
              <Text style={[styles.infoText, { color: theme.icon }]}>
                Age: {playerAge} • Position: {player.position}
              </Text>
              {player.isCaptain && (
                <View style={styles.captainBadge}>
                  <Ionicons name="star" size={16} color="#f1c40f" />
                  <Text style={[styles.captainText, { color: '#f1c40f' }]}>Captain</Text>
                </View>
              )}
            </View>
          </View>
          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={32} 
              color={isFavorite ? "#e74c3c" : theme.icon} 
            />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Playing Time',
              formatMinutesToHours(player.MinutesPlayed),
              'time-outline'
            )}
            {renderStatCard(
              'Pass Accuracy',
              formatPassingAccuracy(player.PassingAccuracy),
              'checkmark-circle-outline'
            )}
            {renderStatCard(
              'Position',
              player.position,
              'person-outline'
            )}
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Player Reviews & Ratings
          </Text>
          {renderFeedbacksByRating()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerTeam: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  basicInfo: {
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  captainText: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  feedbackSection: {
    gap: 12,
  },
  ratingOverview: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  ratingStars: {
    fontSize: 24,
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 14,
  },
  ratingGroup: {
    marginVertical: 4,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingText: {
    fontSize: 18,
  },
  ratingCount: {
    fontSize: 14,
  },
  feedbackList: {
    marginTop: 8,
    gap: 8,
  },
  feedbackItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 16,
  },
  feedbackComment: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  feedbackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackDate: {
    fontSize: 12,
  },
  noFeedback: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
});
