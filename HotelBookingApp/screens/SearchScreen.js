import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from '../styles/AppStyles';
import colors from '../constants/colors';

export default function SearchScreen({ navigation }) {
  const [location, setLocation] = React.useState('');
  const [numPeople, setNumPeople] = React.useState('');

  const [checkInDate, setCheckInDate] = React.useState(new Date());
  const [checkOutDate, setCheckOutDate] = React.useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  
  const [isPickerVisible, setPickerVisibility] = React.useState(false);
  const [activePicker, setActivePicker] = React.useState(null); // 'checkin' or 'checkout'

  const handleSearch = () => {
    if (!location.trim()) {
      Alert.alert("Invalid Input", "Please enter a location to search.");
      return;
    }
    const guests = parseInt(numPeople, 10);
    if (isNaN(guests) || guests <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of guests.");
      return;
    }
    const checkIn = new Date(checkInDate.setHours(0, 0, 0, 0));
    const checkOut = new Date(checkOutDate.setHours(0, 0, 0, 0));
    if (checkOut <= checkIn) {
      Alert.alert("Invalid Dates", "Check-out date must be after the check-in date.");
      return;
    }
    navigation.navigate('List', { location: location.trim() });
  };

  const showDatePickerFor = (target) => {
    setActivePicker(target);
    setPickerVisibility(true);
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
    setPickerVisibility(false);
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

        <TouchableOpacity style={styles.inputButton} onPress={() => showDatePickerFor('checkin')}>
          <Text style={styles.inputText}>Check-in: {checkInDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputButton} onPress={() => showDatePickerFor('checkout')}>
          <Text style={styles.inputText}>Check-out: {checkOutDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isPickerVisible}
          onRequestClose={() => setPickerVisibility(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
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
