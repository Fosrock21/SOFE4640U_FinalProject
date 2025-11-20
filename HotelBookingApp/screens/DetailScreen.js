import React, { useState } from 'react';
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
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { transcribeAudio, callGeminiWithText } from '../services/GeminiService';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  // Get the hotel object passed from ListScreen
  const { hotel } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [geminiResponse, setGeminiResponse] = useState('');

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true); // Toggle state
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setIsRecording(false); // Toggle state
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    
    const transcription = await transcribeAudio(uri);
    setGeminiResponse(`You said: ${transcription}`);

    const response = await callGeminiWithText(transcription);
    setGeminiResponse(response);
    Speech.speak(response);
    console.log('Gemini response:', response);
  }

  console.log('DetailScreen hotel:', hotel); // Debug log

  if (!hotel) {
    console.log('No hotel data found!');
    return null;
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
          <TouchableOpacity
            style={styles.promoCard}
            activeOpacity={0.9}
            onPress={() => setShowVirtualTour(true)}
          >
            <Text style={styles.promoTitle}>Experience in 360°</Text>
            <Text style={styles.promoText}>
              Explore every corner of our resort with our immersive virtual tour
            </Text>
            <View style={styles.promoButton}>
              <Ionicons name="play" size={20} color="#0F172A" style={{ marginRight: 8 }} />
              <Text style={styles.promoButtonText}>Launch Virtual Tour</Text>
            </View>
          </TouchableOpacity>

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

          {/* AI Assistant Response */}
          {geminiResponse && (
            <>
              <Text style={styles.sectionTitle}>AI Assistant Response</Text>
              <Text style={styles.description}>{geminiResponse}</Text>
            </>
          )}

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

      {/* Floating AI Assistant Button */}
      <TouchableOpacity
        style={[styles.aiButton, isRecording && styles.aiButtonRecording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Feather name={isRecording ? "stop-circle" : "mic"} size={28} color="white" />
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

      {/* Virtual Tour Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showVirtualTour}
        onRequestClose={() => setShowVirtualTour(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Virtual Tour - 360° View</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowVirtualTour(false)}
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
              <View style={styles.tourVideoPlaceholder}>
                <View style={styles.tourPlayIconLarge}>
                  <Ionicons name="play" size={48} color="white" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.tourPlaceholderTitle}>360° Virtual Tour</Text>
                <Text style={styles.tourPlaceholderText}>Interactive video tour would play here</Text>
              </View>

              {/* Tour Options */}
              <View style={styles.tourOptions}>
                <TouchableOpacity style={styles.tourOptionActive}>
                  <Text style={styles.tourOptionTextActive}>Lobby View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tourOption}>
                  <Text style={styles.tourOptionText}>Room View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tourOption}>
                  <Text style={styles.tourOptionText}>Pool Area</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
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
  tourButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  virtualTourButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  playIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tourTextContainer: {
    alignItems: 'flex-start',
  },
  tourText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tourSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
  aiButtonRecording: {
    backgroundColor: '#EF4444', // A red color to indicate recording
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

  // Modal Styles
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
});