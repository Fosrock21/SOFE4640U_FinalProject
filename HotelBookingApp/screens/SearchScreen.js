import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  View,
  Button,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../styles/AppStyles';
import colors from '../constants/colors';

export default function SearchScreen({ navigation }) {
  const [location, setLocation] = React.useState('');
  const [numPeople, setNumPeople] = React.useState('');

  const [checkInDate, setCheckInDate] = React.useState(new Date());
  const [checkOutDate, setCheckOutDate] = React.useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  
  const [showPicker, setShowPicker] = React.useState(false);
  const [activePicker, setActivePicker] = React.useState(null); // 'checkin' or 'checkout'
  const [tempDate, setTempDate] = React.useState(new Date());

  const handleSearch = () => {
    // 1. Validate Location
    if (!location.trim()) {
      Alert.alert("Invalid Input", "Please enter a location to search.");
      return;
    }

    // 2. Validate Number of Guests
    const guests = parseInt(numPeople, 10);
    if (isNaN(guests) || guests <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of guests.");
      return;
    }

    // 3. Validate Dates (set to midnight to compare dates only)
    const checkIn = new Date(checkInDate.setHours(0, 0, 0, 0));
    const checkOut = new Date(checkOutDate.setHours(0, 0, 0, 0));
    if (checkOut <= checkIn) {
      Alert.alert("Invalid Dates", "Check-out date must be after the check-in date.");
      return;
    }

    // If all validation passes:
    navigation.navigate('List', { location: location.trim() });
  };

  const showDatepickerFor = (target) => {
    setActivePicker(target);
    setTempDate(target === 'checkin' ? checkInDate : checkOutDate);
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const newDate = selectedDate || tempDate;
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set') {
        handleDateSelection(newDate);
      }
    } else {
      // On iOS, the picker is controlled, so we just update the temp state.
      // The "Done" button will handle the final selection.
      setTempDate(newDate);
    }
  };

  const handleDateSelection = (newDate) => {
    if (activePicker === 'checkin') {
      setCheckInDate(newDate);
    } else {
      setCheckOutDate(newDate);
    }
    setShowPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.searchContainer}>
        <Text style={styles.searchTitle}>Find your perfect stay</Text>

        <TextInput
          style={styles.input}
          placeholder="Location (e.g., Miami, FL)"
          placeholderTextColor={colors.textSecondary}
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.inputButton} onPress={() => showDatepickerFor('checkin')}>
          <Text style={styles.inputText}>Check-in: {checkInDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputButton} onPress={() => showDatepickerFor('checkout')}>
          <Text style={styles.inputText}>Check-out: {checkOutDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                style={styles.datePicker}
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()} // Prevent selecting past dates
              />
              {Platform.OS === 'ios' && (
                <Button title="Done" onPress={() => handleDateSelection(tempDate)} />
              )}
            </View>
          </View>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Number of Guests (e.g., 2)"
          placeholderTextColor={colors.textSecondary}
          value={numPeople}
          onChangeText={setNumPeople}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search Hotels</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
