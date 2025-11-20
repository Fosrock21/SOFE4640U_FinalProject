// screens/ProfileScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import colors from '../constants/colors';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const displayName = user?.email?.split('@')[0] || 'Guest User'; // simple fallback
  const email = user?.email || 'no-email@unknown.com';

  // Placeholder values until you wire them to real profile data:
  const phone = '+1 (555) 123-4567';
  const location = 'Miami, Florida';

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged in App.js will fire, set user to null, and show LoginScreen
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile &amp; Settings</Text>
          {/* Spacer to keep title centered */}
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Top blue header inside card */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={32} color="#ffffff" />
              </View>

              <View style={styles.cameraBadge}>
                <Ionicons name="camera-outline" size={16} color="#0f172a" />
              </View>
            </View>

            <View style={styles.profileTextBlock}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileRole}>Premium Member</Text>
            </View>
          </View>

          {/* Bottom white details area */}
          <View style={styles.profileDetails}>
            {/* Email row */}
            <View style={styles.infoRow}>
              <MaterialIcons
                name="mail-outline"
                size={20}
                color="#4b5563"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{email}</Text>
            </View>

            {/* Phone row */}
            <View style={styles.infoRow}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#4b5563"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{phone}</Text>
            </View>

            {/* Location row */}
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#4b5563"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{location}</Text>
            </View>
          </View>
        </View>

        {/* Sign Out button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#dc2626"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version label */}
        <Text style={styles.versionText}>Version {appVersion}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6', // light gray
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  profileCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileHeader: {
    backgroundColor: '#0f172a', // deep navy
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextBlock: {
    flex: 1,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileRole: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
  profileDetails: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
  },
});