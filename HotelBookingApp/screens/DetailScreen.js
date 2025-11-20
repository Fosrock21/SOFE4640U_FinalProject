import React, { useState, useRef, useEffect } from 'react';
import { Video, ResizeMode, Audio } from 'expo-av';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Linking,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { callGemini } from '../services/GeminiService';
// import { MOCK_HOTELS } from '../data/mockData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  // Get the hotelId passed from ListScreen
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Enable audio in silent mode for iOS
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const docRef = doc(db, "hotels", hotelId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHotel({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  // Chat State
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', text: "Hello! I can help you with any questions about this hotel." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Update welcome message when hotel is loaded
  useEffect(() => {
    if (hotel) {
      setMessages(prev => {
        // Only update if it's the initial generic message
        if (prev.length === 1 && prev[0].text.includes("this hotel")) {
          return [{ id: '1', role: 'model', text: `Hello! I can help you with any questions about ${hotel.name}.` }];
        }
        return prev;
      });
    }
  }, [hotel]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: inputText };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Filter messages to send only role and text to API
      const apiMessages = newMessages.map(({ role, text }) => ({ role, text }));
      const responseText = await callGemini(apiMessages);

      const botMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, chatVisible]);

  console.log('DetailScreen hotel:', hotel); // Debug log

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0F172A" />
      </SafeAreaView>
    );
  }

  if (!hotel) {
    console.log('No hotel data found!');
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Hotel not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const amenities = [
    { icon: 'wifi', label: 'Free WiFi' },
    { icon: 'coffee', label: 'Breakfast' },
    { icon: 'dumbbell', label: 'Gym' },
    { icon: 'car', label: 'Parking' },
  ];

  // Sample gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYzNTY5NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1654355628827-860147b38be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMj hob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MzUxMDU2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzUzODAyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: hotel.image }} style={styles.heroImage} />

          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setIsLiked(!isLiked)}
            >
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={20}
                color={isLiked ? "#EF4444" : "#0F172A"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentContainer}>
          {/* Header Info */}
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.locationRow}>
                  <Feather name="map-pin" size={16} color="#64748B" />
                  <Text style={styles.locationText}>{hotel.location}</Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <FontAwesome name="star" size={16} color="#EAB308" />
                <Text style={styles.ratingText}>{hotel.rating || '4.8'}</Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Beachfront</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Luxury</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Pool</Text>
              </View>
            </View>
          </View>

          {/* Virtual Tour Promo Card */}
          {/* Video Player */}
          <View style={styles.videoContainer}>
            <Video
              style={styles.video}
              source={require('../assets/RitzCarltonToronto.mp4')}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityBox}>
                <View style={styles.amenityIconCircle}>
                  <MaterialCommunityIcons name={amenity.icon} size={24} color="#0F172A" />
                </View>
                <Text style={styles.amenityLabel}>{amenity.label}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {hotel.description ||
              `Experience luxury at its finest at ${hotel.name}. Located in ${hotel.location}, our resort offers breathtaking views, world-class amenities, and exceptional service. Each room is designed with comfort and elegance in mind, featuring modern furnishings and stunning vistas.`}
          </Text>

          {/* Location Map */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            {hotel.latitude && hotel.longitude ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: hotel.latitude,
                  longitude: hotel.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: hotel.latitude,
                    longitude: hotel.longitude,
                  }}
                  title={hotel.name}
                  description={hotel.location}
                />
              </MapView>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Feather name="map-pin" size={32} color="#94A3B8" />
                <Text style={styles.mapPlaceholderText}>Map location unavailable</Text>
              </View>
            )}
          </View>

          {/* Gallery */}
          <Text style={styles.sectionTitle}>Gallery</Text>
          <View style={styles.galleryGrid}>
            {galleryImages.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
            ))}
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactSection}>
            <TouchableOpacity style={styles.contactRow}>
              <Feather name="phone" size={20} color="#0F172A" />
              <Text style={styles.contactText}>+1 (305) 555-0123</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactRow}>
              <Feather name="mail" size={20} color="#0F172A" />
              <Text style={styles.contactText}>info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing for Fixed Elements */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.aiButton}
        onPress={() => setChatVisible(true)}
      >
        <MaterialCommunityIcons name="robot" size={28} color="white" />
      </TouchableOpacity>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.fromText}>From</Text>
          <Text style={styles.priceText}>${hotel.price || '289'}/night</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => Linking.openURL('https://hotels.com')}
        >
          <Feather name="calendar" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>



      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatModalOverlay}
        >
          <View style={styles.chatModalContainer}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderTitleRow}>
                <MaterialCommunityIcons name="robot" size={24} color="#6366F1" />
                <Text style={styles.chatTitle}>AI Assistant</Text>
              </View>
              <TouchableOpacity
                style={styles.closeChatButton}
                onPress={() => setChatVisible(false)}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              style={styles.messagesList}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={[
                  styles.messageBubble,
                  item.role === 'user' ? styles.userMessage : styles.botMessage
                ]}>
                  <Text style={[
                    styles.messageText,
                    item.role === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}>{item.text}</Text>
                </View>
              )}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Ask about the hotel..."
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A10',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#0F172A10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  promoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  amenityBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  amenityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  galleryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  galleryImage: {
    width: (width - 72) / 3,
    height: 96,
    borderRadius: 16,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
  },
  aiButton: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  fromText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  bookButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#F1F5F9',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    color: '#94A3B8',
    fontSize: 14,
  },

  // Virtual Tour Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    color: '#FFFFFF',
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tourVideoPlaceholder: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 24,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  videoContainer: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  tourPlayIconLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tourPlaceholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tourPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tourOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  tourOptionActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tourOptionTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tourOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tourOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Chat Modal Styles
  chatModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatModalContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 12,
  },
  closeChatButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  messagesList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#1E293B',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
});