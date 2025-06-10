import { Player } from '@/types/Player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = process.env.EXPO_PUBLIC_FAVORITES_KEY || "";

export const favoritesService = {
  // Get all favorite players
  async getFavorites(): Promise<Player[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add player to favorites
  async addToFavorites(player: Player): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === player.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, player];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  // Remove player from favorites
  async removeFromFavorites(playerId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== playerId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  // Check if player is in favorites
  async isFavorite(playerId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === playerId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  // Clear all favorites
  async clearFavorites(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }
};
