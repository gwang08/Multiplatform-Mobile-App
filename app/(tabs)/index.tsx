import { LoadingComponent } from "@/components/LoadingComponent";
import { PlayerCard } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";
import { TeamFilter } from "@/components/TeamFilter";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { favoritesService } from "@/services/favoritesService";
import { playerService } from "@/services/playerService";
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

export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { state, dispatch } = useAppContext();

  // Load favorites when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [players, selectedTeam, searchQuery]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await favoritesService.getFavorites();
      dispatch({ type: 'SET_FAVORITES', payload: favoritesData });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, teamsData] = await Promise.all([
        playerService.getAllPlayers(),
        playerService.getTeams(),
      ]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load players data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filterPlayers = () => {
    let filtered = players;

    // Filter by team
    if (selectedTeam) {
      filtered = filtered.filter((player) => player.team === selectedTeam);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (player) =>
          player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlayers(filtered);
  };

  const handlePlayerPress = (player: Player) => {
    router.push(`/player/${player.id}`);
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerCard
      player={item}
      onPress={() => handlePlayerPress(item)}
      onFavoriteToggle={() => {}}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.text }]}>
        {searchQuery || selectedTeam
          ? "No players match your criteria"
          : "No players available"}
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingComponent message="Loading players..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Football Players
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search players, teams, positions..."
        />
        
        <TeamFilter
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamSelect={setSelectedTeam}
        />
      </View>
    
      <FlatList
        data={filteredPlayers}
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  listContent: {
    paddingBottom: 100, // Account for tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
