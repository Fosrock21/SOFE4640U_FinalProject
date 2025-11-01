import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- Mock Database ---
// A hardcoded JSON array to act as a mock database for hotel listings.
const MOCK_HOTELS = [
  {
    id: '1',
    name: 'Lakeside Luxury Lodge',
    price: '$250/night',
    location: 'Toronto, ON',
    description: 'Experience unparalleled luxury with stunning lake views. Our lodge offers world-class amenities and serene surroundings, perfect for a peaceful getaway.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Metropolis Grand Hotel',
    price: '$300/night',
    location: 'Vancouver, BC',
    description: 'Located in the heart of the city, the Metropolis Grand offers easy access to all major attractions. Enjoy our rooftop pool and fine dining restaurant.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'The Cozy Corner Inn',
    price: '$120/night',
    location: 'Halifax, NS',
    description: 'A charming and cozy inn with a personal touch. Perfect for travelers looking for a quiet and comfortable stay with a homemade breakfast included.',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Mountain Peak Resort',
    price: '$400/night',
    location: 'Banff, AB',
    description: 'Nestled in the Rocky Mountains, our resort is an ideal spot for adventure seekers. Ski, hike, or simply relax and enjoy the breathtaking mountain scenery.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Historic Old Town Suites',
    price: '$180/night',
    location: 'Quebec City, QC',
    description: 'Stay in a beautifully restored historic building in the charming Old Town. Our suites blend classic architecture with modern comforts.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Urban Modern Lofts',
    price: '$210/night',
    location: 'Montreal, QC',
    description: 'Stylish and spacious lofts in a trendy, artistic neighborhood. Featuring high ceilings, large windows, and contemporary design.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '7',
    name: 'Seaside Serenity Villas',
    price: '$350/night',
    location: 'Victoria, BC',
    description: 'Private villas with direct beach access. Wake up to the sound of waves and enjoy stunning ocean sunsets from your own patio.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop',
  },
];

// --- Screens ---

function ListScreen({ navigation }) {
  // Using a card-based layout as suggested by the project context.
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { hotelId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_HOTELS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

function DetailScreen({ route }) {
  const { hotelId } = route.params;
  const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);

  if (!hotel) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hotel not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: hotel.image }} style={styles.detailImage} />
        <View style={styles.detailContent}>
          <Text style={styles.detailTitle}>{hotel.name}</Text>
          <Text style={styles.detailSubtitle}>{hotel.location}</Text>
          <Text style={styles.detailPrice}>{hotel.price}</Text>
          <View style={styles.separator} />
          <Text style={styles.detailDescription}>{hotel.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Navigation ---

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#003580',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={{ title: 'Available Properties' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailScreen}
          options={({ route }) => {
            const hotel = MOCK_HOTELS.find(h => h.id === route.params.hotelId);
            return { title: hotel ? hotel.name : 'Details' };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F7',
  },
  listContainer: {
    padding: 16,
  },
  // Card styles for the list screen
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPrice: {
    fontSize: 16,
    color: '#003580',
    marginTop: 8,
  },
  // Detail screen styles
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});