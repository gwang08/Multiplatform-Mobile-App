import { fetchPlayers } from '@/api/Football';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAVORITES_KEY = 'favoritePlayers';

type Player = {
  id: string;
  playerName: string;
  YoB: number;
  MinutesPlayed: number;
  position: string;
  isCaptain: boolean;
  image: string;
  team: string;
  PassingAccuracy: number;
};


type PlayerDetailRouteParams = {
  id: string;
};

type RootStackParamList = {
  PlayerDetail: PlayerDetailRouteParams;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PlayerDetail'>;

export default function FavoriteScreen() {
  const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);
  const navigation = useNavigation<NavigationProp>();

  const reloadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const favoriteIds = JSON.parse(favorites);
        const allPlayers = await fetchPlayers();
        const favoriteDetails = allPlayers.filter((player: Player) => favoriteIds.includes(player.id));
        setFavoritePlayers(favoriteDetails);
      } else {
        setFavoritePlayers([]);
      }
    } catch (error) {
      console.error('Error loading favorite players:', error);
    }
  };

  useEffect(() => {
    reloadFavorites();
  }, []);

  const removeFavorite = (playerId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this player from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
              let favoriteIds = favorites ? JSON.parse(favorites) : [];
              favoriteIds = favoriteIds.filter((id: string) => id !== playerId);
              await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
              reloadFavorites();
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
        },
      ]
    );
  };

  const removeAllFavorites = () => {
    Alert.alert(
      'Remove All Favorites',
      'Are you sure you want to remove all favorite players?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(FAVORITES_KEY);
              reloadFavorites();
            } catch (error) {
              console.error('Error removing all favorites:', error);
            }
          },
        },
      ]
    );
  };

  const handlePlayerPress = (playerId: string) => {
    navigation.navigate('PlayerDetail', { id: playerId });
  };

  return (
    <View>
      <Text style={styles.header}>Favorite Players</Text>
      {favoritePlayers.length > 0 && (
        <TouchableOpacity style={styles.removeAllButton} onPress={removeAllFavorites}>
          <Text style={styles.removeAllButtonText}>Remove All</Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {favoritePlayers.map((player, index) => {
          if (!player.id) {
            console.warn(`Player at index ${index} is missing an id.`);
          }
          return (
            <View key={player.id || index} style={styles.playerCard}>
              <TouchableOpacity onPress={() => handlePlayerPress(player.id)}>
                <Image source={{ uri: player.image }} style={styles.playerImage} />
              </TouchableOpacity>
              <View style={styles.playerInfo}>
                <TouchableOpacity onPress={() => handlePlayerPress(player.id)}>
                  <Text style={styles.playerName}>{player.playerName}</Text>
                </TouchableOpacity>
                <Text>Position: {player.position}</Text>
                <Text>Year of Birth: {player.YoB}</Text>
                <Text>Captain: {player.isCaptain ? '✔️' : '❌'}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeFavorite(player.id)}>
                  <FontAwesome name="trash" size={20} color="#d11a2a" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 70,
  },
  playerCard: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    padding: 4,
  },
  removeAllButton: {
    backgroundColor: '#d11a2a',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 10,
  },
  removeAllButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
