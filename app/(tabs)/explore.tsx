import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access location was denied');
      return;
    }

    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      Alert.alert('Location Found', `Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lng: ${currentLocation.coords.longitude.toFixed(4)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const generateAIResponse = async () => {
    // Simulated AI response since we can't use real Gemini API in this demo
    const responses = [
      "Based on the football statistics, this player shows excellent potential in midfield positions with strong passing accuracy.",
      "The player's performance metrics indicate a well-rounded athlete with consistent playing time and leadership qualities.",
      "Analysis suggests this player would be valuable for teams seeking experienced defenders with captain potential.",
      "Performance data shows this forward has exceptional goal-scoring potential and team leadership skills.",
      "The statistics reveal a goalkeeper with excellent reflexes and game management abilities."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setAiResponse(randomResponse);
    Alert.alert('AI Analysis Complete', randomResponse);
  };

  const FeatureCard = ({ 
    title, 
    description, 
    icon, 
    onPress, 
    status 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    onPress: () => void; 
    status?: string; 
  }) => (
    <Pressable 
      style={[styles.featureCard, { backgroundColor: theme.background, borderColor: theme.icon }]}
      onPress={onPress}
    >
      <View style={styles.featureHeader}>
        <Ionicons name={icon as any} size={32} color={theme.tint} />
        <View style={styles.featureInfo}>
          <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.featureDescription, { color: theme.icon }]}>{description}</Text>
          {status && (
            <Text style={[styles.featureStatus, { color: theme.tint }]}>{status}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Advanced Features</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            Explore additional capabilities of the Football Player app
          </Text>
        </View>

        <View style={styles.content}>
          {/* Image Picker Section */}
          <FeatureCard
            title="Image Picker"
            description="Select or capture player photos"
            icon="camera"
            onPress={pickImage}
            status={selectedImage ? "Image selected" : undefined}
          />

          <FeatureCard
            title="Camera"
            description="Take a photo with camera"
            icon="camera-outline"
            onPress={takePhoto}
          />

          {selectedImage && (
            <View style={[styles.imageContainer, { borderColor: theme.icon }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Selected Image</Text>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <Pressable 
                style={[styles.removeButton, { backgroundColor: theme.tint }]}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeButtonText}>Remove Image</Text>
              </Pressable>
            </View>
          )}

          {/* Location Section */}
          <FeatureCard
            title="Location Services"
            description="Get current location for stadium check-ins"
            icon="location"
            onPress={getLocation}
            status={location ? `Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : undefined}
          />

          {/* AI Integration */}
          <FeatureCard
            title="AI Player Analysis"
            description="Get AI-powered insights about player performance"
            icon="bulb"
            onPress={generateAIResponse}
            status={aiResponse ? "Analysis completed" : undefined}
          />

          {aiResponse && (
            <View style={[styles.aiContainer, { backgroundColor: theme.background, borderColor: theme.tint }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Analysis</Text>
              <Text style={[styles.aiResponse, { color: theme.text }]}>{aiResponse}</Text>
            </View>
          )}

          {/* App Statistics */}
          <View style={[styles.statsContainer, { backgroundColor: theme.background, borderColor: theme.icon }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>App Statistics</Text>
            <View style={styles.stat}>
              <Ionicons name="people" size={24} color={theme.tint} />
              <Text style={[styles.statText, { color: theme.text }]}>Players Database</Text>
              <Text style={[styles.statValue, { color: theme.tint }]}>50+</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="flag" size={24} color={theme.tint} />
              <Text style={[styles.statText, { color: theme.text }]}>Teams Available</Text>
              <Text style={[styles.statValue, { color: theme.tint }]}>10+</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="star" size={24} color={theme.tint} />
              <Text style={[styles.statText, { color: theme.text }]}>Rating System</Text>
              <Text style={[styles.statValue, { color: theme.tint }]}>5 Stars</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={[styles.aboutContainer, { backgroundColor: theme.background, borderColor: theme.icon }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About This App</Text>
            <Text style={[styles.aboutText, { color: theme.text }]}>
              This football player management app provides comprehensive player statistics, 
              team management, and advanced features including AI analysis, location services, 
              and image management. Built with React Native and Expo for optimal performance.
            </Text>
            <View style={styles.techStack}>
              <Text style={[styles.techTitle, { color: theme.tint }]}>Technology Stack:</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• React Native & Expo</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• TypeScript</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• AsyncStorage</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• MockAPI Integration</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• Expo Image Picker</Text>
              <Text style={[styles.techItem, { color: theme.icon }]}>• Expo Location</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  featureCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  featureStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  imageContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  aiContainer: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  aiResponse: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statText: {
    flex: 1,
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  techStack: {
    gap: 4,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  techItem: {
    fontSize: 14,
  },
});
