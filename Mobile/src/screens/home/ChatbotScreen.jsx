// screens/home/ChatbotScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Send, InputToolbar, Time } from 'react-native-gifted-chat';
import { sendMobileQuery } from '../../services/chatbotService';
import { FontAwesome } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

const colors = {
  background: '#ECE5DD',
  userBubble: '#DCF8C6',
  botBubble: '#FFFFFF',
  inputBackground: '#F0F0F0',
  textPrimary: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  sendButtonActive: '#075E54',
  sendButtonInactive: '#B0B0B0',
  white: '#FFFFFF',
};

const WHATSAPP_WALLPAPER = 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    setMessages([
      {
        _id: `initial-${Math.random()}`,
        text: '¡Hola! 🐾 Soy AnimBot, tu amigo peludo digital. ¿En qué puedo ayudarte hoy? 😸✨',
        createdAt: new Date(),
        user: { _id: 2, name: 'AnimBot' },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages(prev => GiftedChat.append(prev, userMessage));
    setIsLoading(true);

    try {
      const history = messages.slice(0, 10).reverse().map(msg => ({
        role: msg.user._id === 1 ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      const response = await sendMobileQuery(userMessage.text, history);
      const botMessage = {
        _id: `bot-${Math.random()}`,
        text: response.reply,
        createdAt: new Date(),
        user: { _id: 2, name: 'AnimBot' },
      };
      setMessages(prev => GiftedChat.append(prev, botMessage));
    } catch (error) {
      const errorMessage = {
        _id: `error-${Math.random()}`,
        text: error.message || '¡Ups! Algo salió mal. Inténtalo de nuevo 🐾',
        createdAt: new Date(),
        user: { _id: 2, name: 'AnimBot' },
      };
      setMessages(prev => GiftedChat.append(prev, errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const renderBubble = (props) => (
    <Bubble {...props} wrapperStyle={{ left: styles.bubbleLeft, right: styles.bubbleRight }} textStyle={{ left: styles.textCommon, right: styles.textCommon }} renderTime={(timeProps) => (<Time {...timeProps} timeTextStyle={{ left: styles.timeText, right: styles.timeText }} />)} />
  );

  const renderSend = (props) => {
    const canSend = props.text && props.text.trim().length > 0;
    return (
      <Send {...props} containerStyle={styles.sendContainer} disabled={isLoading || !canSend}>
        <View style={[styles.sendButton, { backgroundColor: canSend ? colors.sendButtonActive : colors.sendButtonInactive }]}>
          <FontAwesome name="paper-plane" size={18} color={colors.white} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={styles.inputPrimary} />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        // CAMBIO CLAVE Y DEFINITIVO: Usamos 'padding' para AMBAS plataformas.
        // Es la forma más suave y estable de manejar el teclado.
        // Funciona en conjunto con 'adjustResize' en Android.
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={headerHeight}
      >
        <ImageBackground source={{ uri: WHATSAPP_WALLPAPER }} style={styles.container}>
          {/* GiftedChat ahora está dentro de KAV, y este dentro de SafeAreaView */}
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            placeholder="Escribe un mensaje..."
            alwaysShowSend
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
            textInputStyle={styles.textInput}
            minInputToolbarHeight={60}
            isTyping={isLoading}
            scrollToBottom
            messagesContainerStyle={{ paddingBottom: 10 }}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.inputBackground,
  },
  container: {
    flex: 1,
  },
  bubbleLeft: {
    backgroundColor: colors.botBubble,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginLeft: 8,
  },
  bubbleRight: {
    backgroundColor: colors.userBubble,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  textCommon: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  inputToolbar: {
    backgroundColor: colors.inputBackground,
    borderTopWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    minHeight: 45,
    maxHeight: 120,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
    marginRight: 10,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginBottom: 5,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatbotScreen;