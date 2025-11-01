import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { styles } from '../styles/AppStyles';
import { callGemini } from '../services/GeminiService';
import colors from '../constants/colors';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm your hotel booking assistant. How can I help you find the perfect stay?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await callGemini(newMessages);
      const modelMessage = { role: 'model', text: botResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = { role: 'model', text: "Sorry, something went wrong." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages]);

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.role === 'user' ? styles.userMessage : styles.modelMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        inverted
      />
      {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color={colors.primary} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about hotels, locations..."
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
