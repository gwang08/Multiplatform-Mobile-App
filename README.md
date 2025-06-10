# Football Players App ⚽

A comprehensive React Native mobile application for managing football player information, built with Expo and TypeScript. This app allows users to browse players, view detailed statistics, manage favorites, and explore advanced features like image picking and location services.

## 📱 Features

### Core Features
- **Player Database**: Browse through a comprehensive database of 50+ football players
- **Team Management**: Filter players by teams (10+ teams available)
- **Search Functionality**: Search players by name, team, or position
- **Player Details**: View detailed player statistics, ratings, and feedback
- **Favorites System**: Add/remove players to/from favorites with local storage
- **Rating System**: 5-star rating system with user feedback
- **Pull-to-Refresh**: Real-time data updates

### Advanced Features
- **Image Picker**: Select images from gallery or capture with camera
- **Location Services**: Get current location for stadium check-ins
- **AI Player Analysis**: Simulated AI-powered insights about player performance
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Haptic Feedback**: Enhanced user experience with tactile feedback

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API with useReducer
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: React Native + Expo Vector Icons
- **Image Handling**: Expo Image & Image Picker
- **Location**: Expo Location
- **Platform**: Cross-platform (iOS, Android, Web)

## 📂 Project Structure

```
app/
├── _layout.tsx                # Root layout with navigation setup
├── (tabs)/                    # Tab-based navigation
│   ├── _layout.tsx           # Tab layout configuration
│   ├── index.tsx             # Home screen (players list)
│   ├── favorites.tsx         # Favorites screen
│   └── explore.tsx           # Advanced features screen
└── player/
    └── [id].tsx              # Dynamic player detail screen

components/
├── PlayerCard.tsx            # Reusable player card component
├── SearchBar.tsx             # Search input component
├── TeamFilter.tsx            # Team filter component
├── LoadingComponent.tsx      # Loading state component
└── ui/                       # UI utilities and themed components

services/
├── playerService.ts          # Player data API service
└── favoritesService.ts       # Favorites management service

types/
└── Player.ts                 # TypeScript interfaces

utils/
└── helpers.ts                # Utility functions

context/
└── AppContext.tsx            # Global state management

constants/
└── Colors.ts                 # Theme color definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for emulator)
- Expo Go app (for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quanglmse184185
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_API_URL=your_api_url_here
   EXPO_PUBLIC_FAVORITES_KEY=football_favorites
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Scan QR code with Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## 📱 App Navigation

### Tab Navigation
- **Home**: Browse all players with search and filter options
- **Favorites**: View and manage favorite players
- **Settings**: Explore advanced features and app information

### Screen Flow
```
Home Screen → Player Details → Back to Home
Favorites Screen → Player Details → Back to Favorites
Settings Screen → Feature Demos
```

## 🔧 Key Components

### PlayerCard
Displays player information in a card format with:
- Player image and basic info
- Statistics (playing time, passing accuracy)
- Captain status indicator
- Favorite toggle button

### SearchBar
Real-time search functionality with:
- Search by player name, team, or position
- Clear button for easy reset
- Responsive design

### TeamFilter
Horizontal scrollable team selector:
- Filter players by team
- Clear selection option
- Visual selection feedback

## 💾 Data Management

### Player Service
- Fetches player data from external API
- Handles error states and loading
- Provides team filtering capabilities

### Favorites Service
- Local storage using AsyncStorage
- Add/remove favorites functionality
- Persistent data across app sessions
- Clear all favorites option

## 🎨 Theming

The app supports both light and dark themes:
- Automatic theme detection based on system preference
- Consistent color scheme across all components
- Theme-aware icons and text colors

## 📊 Player Statistics

Each player includes:
- **Basic Info**: Name, age, team, position
- **Performance**: Minutes played, passing accuracy
- **Status**: Captain indicator
- **Ratings**: User feedback with 1-5 star system
- **Reviews**: User comments with timestamps

## 🔒 Permissions

The app requests the following permissions:
- **Camera**: For taking player photos
- **Photo Library**: For selecting existing images
- **Location**: For stadium check-in features

## 🧪 Testing

### Development Testing
```bash
# Run in development mode
npx expo start

# Run with specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Building for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## 📱 Platform Support

- **iOS**: Full feature support with native iOS design patterns
- **Android**: Complete Android compatibility with Material Design
- **Web**: Responsive web version with optimized touch interactions

## 🔄 State Management

The app uses React Context API for global state management:
- Player data caching
- Favorites synchronization
- Search and filter states
- Loading states

## 🎯 Performance Optimizations

- **Image Caching**: Efficient image loading with Expo Image
- **Lazy Loading**: Optimized list rendering with FlatList
- **Memory Management**: Proper cleanup of subscriptions and listeners
- **Bundle Optimization**: Tree-shaking and code splitting

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check your internet connection
   - Verify the API URL in environment variables

2. **Image Loading Problems**
   - Ensure proper permissions are granted
   - Check image URLs are accessible

3. **AsyncStorage Issues**
   - Clear app data and reinstall
   - Check device storage availability

## 📄 License

This project is developed as part of an academic assignment.

## 👥 Contributing

This is an educational project. For suggestions or improvements, please create an issue or submit a pull request.

## 📞 Support

For questions or support, please contact the development team or refer to the Expo documentation.

---

**Note**: This app is designed for educational purposes and demonstrates modern React Native development practices with Expo framework.
