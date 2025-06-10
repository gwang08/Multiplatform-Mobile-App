export interface Feedback {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface Player {
  id: string;
  playerName: string;
  MinutesPlayed: number;
  YoB: number;
  position: string;
  isCaptain: boolean;
  image: string;
  team: string;
  PassingAccuracy: number;
  feedbacks: Feedback[];
}

export interface Team {
  name: string;
  players: Player[];
}
