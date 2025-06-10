import { Player } from '@/types/Player';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface AppState {
  players: Player[];
  favorites: Player[];
  selectedTeam: string | null;
  searchQuery: string;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'SET_FAVORITES'; payload: Player[] }
  | { type: 'SET_SELECTED_TEAM'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_FAVORITE'; payload: Player }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' };

const initialState: AppState = {
  players: [],
  favorites: [],
  selectedTeam: null,
  searchQuery: '',
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_SELECTED_TEAM':
      return { ...state, selectedTeam: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
      };
    case 'CLEAR_FAVORITES':
      return { ...state, favorites: [] };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
