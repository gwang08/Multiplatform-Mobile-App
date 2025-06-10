import { favoritesService } from '@/services/favoritesService';
import { Player } from '@/types/Player';
import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoritesService.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (player: Player): Promise<boolean> => {
    try {
      const success = await favoritesService.addToFavorites(player);
      if (success) {
        setFavorites(prev => [...prev, player]);
      }
      return success;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (playerId: string): Promise<boolean> => {
    try {
      const success = await favoritesService.removeFromFavorites(playerId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== playerId));
      }
      return success;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  const isFavorite = (playerId: string): boolean => {
    return favorites.some(fav => fav.id === playerId);
  };

  const clearAllFavorites = async (): Promise<boolean> => {
    try {
      const success = await favoritesService.clearFavorites();
      if (success) {
        setFavorites([]);
      }
      return success;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
    refresh: loadFavorites
  };
}
