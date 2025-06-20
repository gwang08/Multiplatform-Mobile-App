import { LoadingComponent } from "@/components/LoadingComponent";
import { PlayerCard } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { favoritesService } from "@/services/favoritesService";
import { Player } from "@/types/Player";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const [filteredFavorites, setFilteredFavorites] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    filterFavorites();
  }, [state.favorites, searchQuery]);
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoritesService.getFavorites();
      dispatch({ type: "SET_FAVORITES", payload: favoritesData });
    } catch (error) {
      Alert.alert("Error", "Failed to load favorites");
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);
  const filterFavorites = () => {
    let filtered = state.favorites;

    if (searchQuery) {
      filtered = filtered.filter(
        (player: Player) =>
          player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFavorites(filtered);
  };

  const handlePlayerPress = (player: Player) => {
    router.push(`/player/${player.id}`);
  };

  const handleFavoriteToggle = () => {
    loadFavorites(); // Reload favorites when a player is removed
  };

  const clearAllFavorites = async () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all players from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await favoritesService.clearFavorites();
              dispatch({ type: "CLEAR_FAVORITES" });
              Alert.alert("Success", "All favorites have been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear favorites");
            }
          },
        },
      ]
    );
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerCard
      player={item}
      onPress={() => handlePlayerPress(item)}
      onFavoriteToggle={handleFavoriteToggle}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.text }]}>
        {searchQuery
          ? "No favorite players match your search"
          : "No favorite players yet"}
      </Text>
      {!searchQuery && (
        <Text style={[styles.emptySubtext, { color: theme.icon }]}>
          Add players to your favorites from the Home screen
        </Text>
      )}
    </View>
  );

  if (loading) {
    return <LoadingComponent message="Loading favorites..." />;
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Favorites</Text>
        {state.favorites.length > 0 && (
          <Text
            style={[styles.clearButton, { color: theme.tint }]}
            onPress={clearAllFavorites}
          >
            Clear All
          </Text>
        )}
      </View>
      {state.favorites.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search favorite players..."
        />
      )}
      <FlatList
        data={filteredFavorites}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.tint}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  clearButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 100, // Account for tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
