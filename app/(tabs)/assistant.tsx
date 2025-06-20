import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CHAT_STORAGE_KEY = '@chat_messages';

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Load messages from storage
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } else {
        // Set default welcome message if no saved messages
        const defaultMessage: Message = {
          id: '1',
          text: 'Xin chào! Tôi là AI Assistant được hỗ trợ bởi Gemini. Tôi có thể giúp bạn trả lời các câu hỏi. Hãy hỏi tôi bất cứ điều gì!',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([defaultMessage]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Save messages to storage
  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  // Clear all chat messages
  const clearChat = async () => {
    Alert.alert(
      'Xóa Chat',
      'Bạn có chắc muốn xóa toàn bộ lịch sử chat?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const defaultMessage: Message = {
              id: '1',
              text: 'Xin chào! Tôi là AI Assistant được hỗ trợ bởi Gemini. Tôi có thể giúp bạn trả lời các câu hỏi. Hãy hỏi tôi bất cứ điều gì!',
              isUser: false,
              timestamp: new Date(),
            };
            setMessages([defaultMessage]);
            await saveMessages([defaultMessage]);
          },
        },
      ]
    );
  };

  const sendMessageToGemini = async (message: string) => {
    try {
      const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      
      if (!API_KEY) {
        throw new Error('API Key không được tìm thấy');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ API');
      }
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const newMessagesWithUser = [...messages, userMessage];
    setMessages(newMessagesWithUser);
    await saveMessages(newMessagesWithUser);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(inputText.trim());
      
      const aiMessage: Message = {
        id: generateId(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessagesWithUser, aiMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        text: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessagesWithUser, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
      Alert.alert('Lỗi', 'Không thể kết nối với AI. Vui lòng kiểm tra kết nối internet và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.isUser ? theme.tint : theme.background,
          borderColor: item.isUser ? theme.tint : theme.icon,
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.isUser ? (colorScheme === 'dark' ? '#000' : '#fff') : theme.text }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          { color: item.isUser ? (colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)') : theme.icon }
        ]}>
          {item.timestamp.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.icon }]}>
          <View style={styles.headerContent}>
            <Ionicons name="chatbubbles" size={24} color={theme.tint} />
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Gemini AI Chat
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color={theme.icon} />
            </TouchableOpacity>
            <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.loadingBubble, { borderColor: theme.icon }]}>
              <Text style={[styles.loadingText, { color: theme.icon }]}>
                AI đang soạn phản hồi...
              </Text>
            </View>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { 
          backgroundColor: theme.background,
          borderTopColor: theme.icon 
        }]}>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.background,
              borderColor: theme.icon,
              color: theme.text 
            }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập tin nhắn của bạn..."
            placeholderTextColor={theme.icon}
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, { 
              backgroundColor: theme.tint,
              opacity: (!inputText.trim() || isLoading) ? 0.5 : 1 
            }]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={colorScheme === 'dark' ? '#000' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: '80%',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
