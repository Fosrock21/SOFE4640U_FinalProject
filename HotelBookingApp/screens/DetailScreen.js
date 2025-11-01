import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
} from 'react-native';
import { MOCK_HOTELS } from '../data/mockData';
import { styles } from '../styles/AppStyles';

export default function DetailScreen({ route }) {
  const { hotelId } = route.params;
  const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);

  if (!hotel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hotel not found.</Text>
        </View>
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
