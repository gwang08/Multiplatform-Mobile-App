import { Player } from '@/types/Player';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

export const playerService = {
  // Fetch all players
  async getAllPlayers(): Promise<Player[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const players: Player[] = await response.json();
      return players;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  // Fetch player by ID
  async getPlayerById(id: string): Promise<Player | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player');
      }
      const player: Player = await response.json();
      return player;
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  },

  // Get unique teams
  async getTeams(): Promise<string[]> {
    try {
      const players = await this.getAllPlayers();
      const teams = [...new Set(players.map(player => player.team))];
      return teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  },

  // Filter players by team
  async getPlayersByTeam(team: string): Promise<Player[]> {
    try {
      const players = await this.getAllPlayers();
      return players.filter(player => player.team === team);
    } catch (error) {
      console.error('Error filtering players by team:', error);
      return [];
    }
  }
};
