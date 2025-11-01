import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MOCK_HOTELS } from '../data/mockData';
import { styles } from '../styles/AppStyles';

export default function ListScreen({ route, navigation }) {
  const searchLocation = route.params?.location;

  const filteredHotels = React.useMemo(() => {
    if (!searchLocation) {
      return MOCK_HOTELS;
    }
    return MOCK_HOTELS.filter(hotel =>
      hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }, [searchLocation]);

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
      <View style={{ flex: 1 }}>
        {filteredHotels.length > 0 ? (
          <FlatList
            data={filteredHotels}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hotels found for this location.</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.fabContainer} 
          onPress={() => navigation.navigate('Chatbot')}
        >
          <View style={styles.fab}>
            <Text style={styles.fabIcon}>💬</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
