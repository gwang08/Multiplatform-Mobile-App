import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { favoritesService } from '@/services/favoritesService';
import { Player } from '@/types/Player';
import { calculateAge, formatMinutesToHours, formatPassingAccuracy, getPlayerPosition } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
  onFavoriteToggle?: () => void;
}

export function PlayerCard({ player, onPress, onFavoriteToggle }: PlayerCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { state, dispatch } = useAppContext();
  useEffect(() => {
    checkFavoriteStatus();
  }, [player.id, state.favorites]);

  const checkFavoriteStatus = async () => {
    // Check from context first, then fallback to AsyncStorage
    const isInContext = state.favorites.some(fav => fav.id === player.id);
    if (isInContext) {
      setIsFavorite(true);
    } else {
      const favoriteStatus = await favoritesService.isFavorite(player.id);
      setIsFavorite(favoriteStatus);
    }
  };
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(player.id);
        setIsFavorite(false);
        // Update context
        dispatch({ type: 'REMOVE_FAVORITE', payload: player.id });
        Alert.alert('Removed', `${player.playerName} removed from favorites`);
      } else {
        await favoritesService.addToFavorites(player);
        setIsFavorite(true);
        // Update context
        dispatch({ type: 'ADD_FAVORITE', payload: player });
        Alert.alert('Added', `${player.playerName} added to favorites`);
      }
      onFavoriteToggle?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const playerAge = calculateAge(player.YoB);

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: theme.background, borderColor: theme.icon }]} 
      onPress={onPress}
      android_ripple={{ color: theme.tint + '20' }}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: player.image }} 
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {player.playerName}
          </Text>
          <Text style={[styles.team, { color: theme.icon }]}>
            {player.team}
          </Text>
          <View style={styles.details}>
            <Text style={[styles.detail, { color: theme.text }]}>
              Age: {playerAge}
            </Text>
            <Text style={[styles.detail, { color: theme.text }]}>
              Pos: {getPlayerPosition(player.position)}
            </Text>
          </View>
        </View>
        <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#e74c3c" : theme.icon} 
          />
        </Pressable>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Playing Time</Text>
          <Text style={[styles.statValue, { color: theme.tint }]}>
            {formatMinutesToHours(player.MinutesPlayed)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Pass Accuracy</Text>
          <Text style={[styles.statValue, { color: theme.tint }]}>
            {formatPassingAccuracy(player.PassingAccuracy)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Captain</Text>
          <Ionicons 
            name={player.isCaptain ? "star" : "star-outline"} 
            size={20} 
            color={player.isCaptain ? "#f1c40f" : theme.icon} 
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  team: {
    fontSize: 14,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detail: {
    fontSize: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
