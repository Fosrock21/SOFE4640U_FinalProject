import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
// import { Video } from 'expo-av';
// import MapView, { Marker } from 'react-native-maps';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MOCK_HOTELS } from '../data/mockData';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { hotelId } = route.params;
  const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
  const [isPlaying, setIsPlaying] = React.useState(false);

  if (!hotel) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: hotel.image }} style={styles.heroImage} />

          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton}>
              <Feather name="heart" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Virtual Tour Floating Pill */}
          <TouchableOpacity style={styles.virtualTourPill} onPress={() => setIsPlaying(!isPlaying)}>
            <View style={styles.playIconContainer}>
              <Ionicons name="play" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.vtText}>Watch Virtual Tour</Text>
              <Text style={styles.vtSubText}>360° Interactive View</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={styles.contentContainer}>
          {/* Header Info */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color={colors.textSecondary} />
                <Text style={styles.locationText}>{hotel.location}</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {['Beachfront', 'Luxury', 'Pool'].map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Virtual Tour Card */}
          {/* {isPlaying && (
            <View style={styles.videoCard}>
               <Video
                  style={styles.video}
                  source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                  shouldPlay={isPlaying}
                />
            </View>
          )} */}
          {isPlaying && <View style={styles.videoCard}><Text>Video Disabled</Text></View>}

          {!isPlaying && (
            <View style={styles.promoCard}>
              <Text style={styles.promoTitle}>Experience in 360°</Text>
              <Text style={styles.promoText}>
                Explore every corner of our resort with our immersive virtual tour
              </Text>
              <TouchableOpacity style={styles.promoButton} onPress={() => setIsPlaying(true)}>
                <Feather name="play-circle" size={20} color="#0A1931" />
                <Text style={styles.promoButtonText}>Launch Virtual Tour</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {[
              { icon: 'wifi', label: 'Free WiFi' },
              { icon: 'coffee', label: 'Breakfast' },
              { icon: 'dumbbell', label: 'Gym' },
              { icon: 'car', label: 'Parking' },
            ].map((item, index) => (
              <View key={index} style={styles.amenityBox}>
                <View style={styles.amenityIconCircle}>
                  <MaterialCommunityIcons name={item.icon} size={24} color="#0A1931" />
                </View>
                <Text style={styles.amenityLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{hotel.description}</Text>

          {/* Gallery */}
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryRow}>
            {[hotel.image, hotel.image, hotel.image].map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
            ))}
          </ScrollView>

          {/* Map Location */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            {/* <MapView
              style={styles.map}
              initialRegion={{
                latitude: hotel.latitude || 37.78825,
                longitude: hotel.longitude || -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: hotel.latitude || 37.78825,
                  longitude: hotel.longitude || -122.4324,
                }}
              />
            </MapView> */}
            <View style={styles.map}><Text>Map Disabled</Text></View>
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactRow}>
            <Feather name="phone" size={18} color="#0A1931" />
            <Text style={styles.contactText}>+1 (305) 555-0123</Text>
          </View>
          <View style={styles.contactRow}>
            <Feather name="mail" size={18} color="#0A1931" />
            <Text style={styles.contactText}>info@oceanparadise.com</Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity style={styles.aiButton} onPress={() => navigation.navigate('Chatbot')}>
        <MaterialCommunityIcons name="microphone" size={24} color="white" />
        <Text style={styles.aiButtonText}>AI Assistant</Text>
      </TouchableOpacity>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.fromText}>From</Text>
          <Text style={styles.priceText}>{hotel.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => Linking.openURL('https://hotels.com')}>
          <Feather name="calendar" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 350,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  virtualTourPill: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
    paddingRight: 24,
    elevation: 5,
  },
  playIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A1931',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vtText: {
    fontWeight: 'bold',
    color: '#0A1931',
    fontSize: 14,
  },
  vtSubText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1931',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#0A1931',
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    color: '#0A1931',
    fontSize: 12,
    fontWeight: '600',
  },
  promoCard: {
    backgroundColor: '#0A1931',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  videoCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  promoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoText: {
    color: '#B0B8C1',
    marginBottom: 20,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
  },
  promoButtonText: {
    color: '#0A1931',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A1931',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  amenityBox: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityLabel: {
    color: '#0A1931',
    fontWeight: '500',
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  galleryRow: {
    marginBottom: 32,
  },
  galleryImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    color: colors.textSecondary,
    fontSize: 16,
  },
  aiButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#0A1931',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 8,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  fromText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  priceText: {
    color: '#0A1931',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#0A1931',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
