import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const hotels = [
  {
    id: 1,
    name: "Ocean Paradise Resort",
    price: 289,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1729717949712-1c51422693d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc2MzU1MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Miami Beach, FL",
  },
  {
    id: 2,
    name: "Downtown Luxury Hotel",
    price: 199,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzUzODAyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Downtown Miami, FL",
  },
  {
    id: 3,
    name: "Skyline Tower Hotel",
    price: 349,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1694595437436-2ccf5a95591f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjM1Njk3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Brickell, Miami, FL",
  },
  {
    id: 4,
    name: "Boutique Harbor Inn",
    price: 159,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1654355628827-860147b38be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MzUxMDU2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Bayside, Miami, FL",
  },
  {
    id: 5,
    name: "Coastal View Suites",
    price: 229,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYzNTY5NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "South Beach, FL",
  },
];

export default function ListScreen({ navigation }) {
  const [likedHotels, setLikedHotels] = useState([]);
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = React.useState(null);
  const [checkOutDate, setCheckOutDate] = React.useState(null);
  const [activePicker, setActivePicker] = React.useState(null);

  // Modal States
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);

  const toggleLike = (hotelId) => {
    setLikedHotels((prev) =>
      prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const showDatePickerFor = (target) => {
    setActivePicker(target);
    setDateModalVisible(true);
  };

  const onDayPress = (day) => {
    // Adjust for timezone offset to prevent off-by-one day errors
    const adjustedTimestamp = day.timestamp + new Date().getTimezoneOffset() * 60 * 1000;
    const selectedDate = new Date(adjustedTimestamp);

    if (activePicker === 'checkin') {
      setCheckInDate(selectedDate);
    } else {
      setCheckOutDate(selectedDate);
    }
    setDateModalVisible(false);
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { hotel: item })}
      activeOpacity={0.9}
    >
      <View style={styles.cardInner}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(item.id)}
          >
            <FontAwesome
              name={likedHotels.includes(item.id) ? "heart" : "heart-o"}
              size={16}
              color={likedHotels.includes(item.id) ? "#EF4444" : "#0F172A"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View>
            <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color="#64748B" />
              <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.ratingBadge}>
              <FontAwesome name="star" size={12} color="#EAB308" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${item.price}</Text>
              <Text style={styles.perNightText}>/night</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Find Hotels</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => { }} // Profile navigation placeholder
        >
          <Feather name="user" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.navButton} onPress={async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          try {
            let reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            if (reverseGeocode.length > 0) {
              let city = reverseGeocode[0].city;
              let region = reverseGeocode[0].region;
              setSearchQuery(`${city}, ${region}`);
            }
          } catch (error) {
            Alert.alert('Error', 'Could not determine your location. Please try again or enter it manually.');
          }
        }}>
          <Feather name="navigation" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Date and Guests Selection */}
      <View style={styles.selectorsRow}>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => showDatePickerFor('checkin')}
        >
          <View style={styles.iconCircle}>
            <Feather name="calendar" size={20} color="#0F172A" />
          </View>
          <View style={styles.selectorTextContainer}>
            <Text style={styles.selectorLabel}>Check-in</Text>
            <Text style={styles.selectorValue} numberOfLines={1}>{checkInDate ? checkInDate.toLocaleDateString() : 'Select Date'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => showDatePickerFor('checkout')}
        >
          <View style={styles.iconCircle}>
            <Feather name="calendar" size={20} color="#0F172A" />
          </View>
          <View style={styles.selectorTextContainer}>
            <Text style={styles.selectorLabel}>Check-out</Text>
            <Text style={styles.selectorValue} numberOfLines={1}>{checkOutDate ? checkOutDate.toLocaleDateString() : 'Select Date'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.selectorsRow}>
        <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setGuestModalVisible(true)}
          >
            <View style={styles.iconCircle}>
              <Feather name="users" size={20} color="#0F172A" />
            </View>
            <View style={styles.selectorTextContainer}>
              <Text style={styles.selectorLabel}>Guests</Text>
              <Text style={styles.selectorValue}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</Text>
            </View>
          </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={{ paddingRight: 24 }}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setFilterModalVisible(true)}
        >
          <Feather name="sliders" size={16} color="#0F172A" style={{ marginRight: 8 }} />
          <Text style={styles.filterChipText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setPriceModalVisible(true)}
        >
          <Text style={styles.filterChipText}>Price</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setRatingModalVisible(true)}
        >
          <Text style={styles.filterChipText}>Rating</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hotels List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listCount}>{hotels.length} hotels found</Text>
      </View>

      {/* Hotels List */}
      <FlatList
        data={hotels}
        renderItem={renderHotelCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.flatListContainer}
      />

      {/* --- Modals --- */}

      {/* Date Modal (Mock) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dates</Text>
              <TouchableOpacity onPress={() => setDateModalVisible(false)}>
                <Feather name="x" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={onDayPress}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                textSectionTitleColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Guest Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGuestModalVisible}
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Number of Guests</Text>
              <TouchableOpacity onPress={() => setGuestModalVisible(false)}>
                <Feather name="x" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.guestControlRow}>
                <Text style={styles.guestLabel}>Guests</Text>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setGuests(Math.max(1, guests - 1))}
                  >
                    <Feather name="minus" size={16} color="#0F172A" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{guests}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setGuests(Math.min(10, guests + 1))}
                  >
                    <Feather name="plus" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setGuestModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Feather name="x" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {['WiFi', 'Pool', 'Parking', 'Gym', 'Spa', 'Restaurant'].map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.amenityButton,
                      amenities.includes(amenity) && styles.amenityButtonActive
                    ]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <Text style={[
                      styles.amenityText,
                      amenities.includes(amenity) && styles.amenityTextActive
                    ]}>{amenity}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Property Type</Text>
              <View style={styles.propertyTypeContainer}>
                {['Hotels', 'Resorts', 'Apartments', 'Villas'].map((type) => (
                  <TouchableOpacity key={type} style={styles.propertyTypeButton}>
                    <Text style={styles.propertyTypeText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Price Modal (Mock) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPriceModalVisible}
        onRequestClose={() => setPriceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Price Range</Text>
              <TouchableOpacity onPress={() => setPriceModalVisible(false)}>
                <Feather name="x" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.priceRangeDisplay}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceValue}>${priceRange[0]}</Text>
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceBox}>
                  <Text style={styles.priceValue}>${priceRange[1]}</Text>
                </View>
              </View>
              <Text style={styles.mockText}>Slider component would be here</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setPriceModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Price Range</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Minimum Rating</Text>
              <TouchableOpacity onPress={() => setRatingModalVisible(false)}>
                <Feather name="x" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingOption,
                    selectedRating === rating && styles.ratingOptionActive
                  ]}
                  onPress={() => setSelectedRating(rating)}
                >
                  <View style={styles.ratingStarsRow}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={20}
                        color={selectedRating === rating ? "#FFFFFF" : "#EAB308"}
                        style={{ marginRight: 4 }}
                      />
                    ))}
                    <Text style={[
                      styles.ratingOptionText,
                      selectedRating === rating && styles.ratingOptionTextActive
                    ]}>{rating}.0 & up</Text>
                  </View>
                  {selectedRating === rating && <Feather name="check" size={20} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.applyButton, { marginTop: 24 }]}
                onPress={() => setRatingModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 12,
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectorTextContainer: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 24,
    maxHeight: 40,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  listCount: {
    fontSize: 14,
    color: '#64748B',
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInner: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  perNightText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34, // Safe area approximation
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalBody: {
    // flex: 1, // Removed to allow content to determine height
  },
  modalFooter: {
    marginTop: 16,
  },
  mockText: {
    textAlign: 'center',
    color: '#64748B',
    marginVertical: 24,
  },
  applyButton: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Specific Modal Styles
  dateDisplayRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  guestControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
  },
  guestLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    width: 24,
    textAlign: 'center',
  },

  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  amenityButtonActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  amenityText: {
    color: '#0F172A',
    fontWeight: '500',
  },
  amenityTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  propertyTypeContainer: {
    gap: 8,
  },
  propertyTypeButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  propertyTypeText: {
    color: '#0F172A',
    fontSize: 14,
  },

  priceRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  priceSeparator: {
    color: '#64748B',
    fontSize: 20,
  },

  ratingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  ratingOptionActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingOptionText: {
    marginLeft: 8,
    color: '#0F172A',
    fontWeight: '500',
  },
  ratingOptionTextActive: {
    color: '#FFFFFF',
  },
});
