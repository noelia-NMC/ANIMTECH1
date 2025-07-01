// src/screens/perfil/AjustesScreen.jsx

import React, { useState } from 'react';
import { Switch, Alert, Linking } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import {
  Container, Header, BackButton, HeaderTitle, Scroll,
  Section, SectionTitle, SettingRow, SettingIconContainer,
  SettingTextContainer, SettingTitle, SettingSubtitle,
  SettingAction, VersionText, LogoutButton, LogoutButtonText,
  UnitsSelector, UnitOption, UnitText
} from '../../styles/AjustesStyles';

// Objeto de traducciones para i18n
const translations = {
  es: {
    header_title: "Ajustes",
    notifications_section: "Notificaciones",
    collar_alerts: "Alertas del collar",
    event_reminders: "Recordatorios de eventos",
    new_rescues: "Nuevos rescates cerca",
    preferences_section: "Preferencias",
    language: "Idioma",
    language_subtitle: "Selecciona el idioma de la app",
    appearance: "Apariencia",
    appearance_subtitle: "Personaliza los colores de la app",
    temperature_units: "Unidades de temperatura",
    manage_collar: "Gestionar collar", // TEXTO RESTAURADO
    manage_collar_subtitle: "Vincular, desvincular o calibrar", // TEXTO RESTAURADO
    community_section: "Comunidad y soporte",
    contact_support: "Contactar con soporte",
    contact_support_subtitle: "Envíanos tus dudas o problemas",
    rate_app: "Valora nuestra app",
    rate_app_subtitle: "Tu opinión nos ayuda a crecer",
    propose_feature: "Proponer una función",
    propose_feature_subtitle: "¿Tienes una idea? ¡Cuéntanosla!",
    about_section: "Acerca de",
    terms_conditions: "Términos y condiciones",
    app_version: "Versión de la app",
    logout_button: "Cerrar sesión",
    logout_confirm_title: "Cerrar sesión",
    logout_confirm_message: "¿Estás seguro de que quieres salir?",
    cancel: "Cancelar",
    yes_logout: "Sí, salir",
    coming_soon_title: "Próximamente",
    coming_soon_message: (feature) => `La función de "${feature}" estará disponible muy pronto.`,
    error_alert: "Error",
    error_open_link: "No se pudo abrir el enlace.",
    error_open_store: "No se pudo abrir la tienda de aplicaciones.",
    error_open_mail: "No se pudo abrir la app de correo."
  },
  en: {
    header_title: "Settings",
    notifications_section: "Notifications",
    collar_alerts: "Collar alerts",
    event_reminders: "Event reminders",
    new_rescues: "New rescues nearby",
    preferences_section: "Preferences",
    language: "Language",
    language_subtitle: "Select the app language",
    appearance: "Appearance",
    appearance_subtitle: "Customize the app's colors",
    temperature_units: "Temperature units",
    manage_collar: "Manage collar", // RESTORED TEXT
    manage_collar_subtitle: "Link, unlink, or calibrate", // RESTORED TEXT
    community_section: "Community & Support",
    contact_support: "Contact support",
    contact_support_subtitle: "Send us your questions or issues",
    rate_app: "Rate our app",
    rate_app_subtitle: "Your feedback helps us grow",
    propose_feature: "Propose a feature",
    propose_feature_subtitle: "Have an idea? Tell us!",
    about_section: "About",
    terms_conditions: "Terms and conditions",
    app_version: "App version",
    logout_button: "Log out",
    logout_confirm_title: "Log out",
    logout_confirm_message: "Are you sure you want to log out?",
    cancel: "Cancel",
    yes_logout: "Yes, log out",
    coming_soon_title: "Coming Soon",
    coming_soon_message: (feature) => `The "${feature}" feature will be available very soon.`,
    error_alert: "Error",
    error_open_link: "Could not open the link.",
    error_open_store: "Could not open the app store.",
    error_open_mail: "Could not open the mail app."
  }
};


const AjustesScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('es');
  const [notificaciones, setNotificaciones] = useState({ collar: true, eventos: true, rescates: false });
  const [unidades, setUnidades] = useState({ temp: 'C', peso: 'kg' });
  
  const T = translations[language]; 
  const APP_VERSION = "1.0.3"; 

  const handleToggle = (key) => setNotificaciones(prev => ({ ...prev, [key]: !prev[key] }));
  const handleUnitChange = (type, value) => setUnidades(prev => ({...prev, [type]: value}));

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'welcomeShown']);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(T.error_alert, "No se pudo cerrar la sesión.");
    }
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
        T.logout_confirm_title, T.logout_confirm_message,
      [{ text: T.cancel, style: 'cancel' }, { text: T.yes_logout, onPress: cerrarSesion, style: 'destructive' }]
    );
  };
  
  const showComingSoonAlert = (feature) => {
    Alert.alert(T.coming_soon_title, T.coming_soon_message(feature));
  };

  const contactSupport = () => Linking.openURL('mailto:soporte@animtech.com?subject=Ayuda%20desde%20la%20App').catch(() => Alert.alert(T.error_alert, T.error_open_mail));
  const rateApp = () => Linking.openURL('market://details?id=com.animtech').catch(() => Alert.alert(T.error_alert, T.error_open_store));

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </BackButton>
        <HeaderTitle>{T.header_title}</HeaderTitle>
      </Header>

      <Scroll showsVerticalScrollIndicator={false}>
        {/* --- SECCIÓN NOTIFICACIONES --- */}
        <Section>
          <SectionTitle>{T.notifications_section}</SectionTitle>
          <SettingRow activeOpacity={1}>
             <SettingIconContainer color="#ff3b30"><Ionicons name="notifications" size={20} color="#fff" /></SettingIconContainer>
             <SettingTextContainer><SettingTitle>{T.collar_alerts}</SettingTitle></SettingTextContainer>
             <SettingAction><Switch value={notificaciones.collar} onValueChange={() => handleToggle('collar')} trackColor={{false: '#d1d1d6', true: '#34c759'}}/></SettingAction>
          </SettingRow>
          <SettingRow activeOpacity={1}>
             <SettingIconContainer color="#007aff"><Ionicons name="calendar" size={20} color="#fff" /></SettingIconContainer>
             <SettingTextContainer><SettingTitle>{T.event_reminders}</SettingTitle></SettingTextContainer>
             <SettingAction><Switch value={notificaciones.eventos} onValueChange={() => handleToggle('eventos')} trackColor={{false: '#d1d1d6', true: '#34c759'}}/></SettingAction>
          </SettingRow>
           <SettingRow activeOpacity={1}>
             <SettingIconContainer color="#5ac8fa"><MaterialCommunityIcons name="crosshairs-gps" size={20} color="#fff" /></SettingIconContainer>
             <SettingTextContainer><SettingTitle>{T.new_rescues}</SettingTitle></SettingTextContainer>
             <SettingAction><Switch value={notificaciones.rescates} onValueChange={() => handleToggle('rescates')} trackColor={{false: '#d1d1d6', true: '#34c759'}}/></SettingAction>
          </SettingRow>
        </Section>
        
        {/* --- SECCIÓN PREFERENCIAS --- */}
        <Section>
            <SectionTitle>{T.preferences_section}</SectionTitle>
            <SettingRow>
                <SettingIconContainer color="#333"><Ionicons name="language" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.language}</SettingTitle></SettingTextContainer>
                 <SettingAction>
                    <UnitsSelector>
                        <UnitOption active={language === 'es'} onPress={() => setLanguage('es')}><UnitText active={language === 'es'}>ES</UnitText></UnitOption>
                        <UnitOption active={language === 'en'} onPress={() => setLanguage('en')}><UnitText active={language === 'en'}>EN</UnitText></UnitOption>
                    </UnitsSelector>
                </SettingAction>
            </SettingRow>
             <SettingRow onPress={() => showComingSoonAlert(T.appearance)}>
                <SettingIconContainer color="#8e8e93"><Ionicons name="contrast" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.appearance}</SettingTitle><SettingSubtitle>{T.appearance_subtitle}</SettingSubtitle></SettingTextContainer>
                <SettingAction><Ionicons name="chevron-forward" size={22} color="#c7c7cc" /></SettingAction>
            </SettingRow> 
             <SettingRow activeOpacity={1}>
                <SettingIconContainer color="#ff9500"><MaterialCommunityIcons name="temperature-celsius" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.temperature_units}</SettingTitle></SettingTextContainer>
                <SettingAction>
                    <UnitsSelector>
                        <UnitOption active={unidades.temp === 'C'} onPress={() => handleUnitChange('temp', 'C')}><UnitText active={unidades.temp === 'C'}>°C</UnitText></UnitOption>
                        <UnitOption active={unidades.temp === 'F'} onPress={() => handleUnitChange('temp', 'F')}><UnitText active={unidades.temp === 'F'}>°F</UnitText></UnitOption>
                    </UnitsSelector>
                </SettingAction>
             </SettingRow>
             
            {/* --- OPCIÓN DE GESTIONAR COLLAR RESTAURADA --- */}
             <SettingRow onPress={() => showComingSoonAlert(T.manage_collar)}>
                <SettingIconContainer color="#42a8a1"><Ionicons name="hardware-chip-outline" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.manage_collar}</SettingTitle><SettingSubtitle>{T.manage_collar_subtitle}</SettingSubtitle></SettingTextContainer>
                <SettingAction><Ionicons name="chevron-forward" size={22} color="#c7c7cc" /></SettingAction>
            </SettingRow>
        </Section>
        
        {/* --- SECCIÓN COMUNIDAD Y SOPORTE --- */}
        <Section>
            <SectionTitle>{T.community_section}</SectionTitle>
            <SettingRow onPress={contactSupport}>
                <SettingIconContainer color="#34c759"><Ionicons name="send-outline" size={18} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.contact_support}</SettingTitle><SettingSubtitle>{T.contact_support_subtitle}</SettingSubtitle></SettingTextContainer>
            </SettingRow>
             <SettingRow onPress={rateApp}>
                <SettingIconContainer color="#5856d6"><Ionicons name="star" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.rate_app}</SettingTitle><SettingSubtitle>{T.rate_app_subtitle}</SettingSubtitle></SettingTextContainer>
            </SettingRow>
            <SettingRow onPress={() => showComingSoonAlert(T.propose_feature)}>
                <SettingIconContainer color="#ffcc00"><Ionicons name="bulb-outline" size={20} color="#fff" /></SettingIconContainer>
                <SettingTextContainer><SettingTitle>{T.propose_feature}</SettingTitle><SettingSubtitle>{T.propose_feature_subtitle}</SettingSubtitle></SettingTextContainer>
            </SettingRow>
        </Section>
        
        {/* --- SECCIÓN ACERCA DE --- */}
        <Section>
          <SectionTitle>{T.about_section}</SectionTitle>
           <SettingRow onPress={() => Linking.openURL('https://animtech.com/terms').catch(() => Alert.alert(T.error_alert, T.error_open_link))}>
             <SettingIconContainer color="#a0aec0"><Ionicons name="document-text-outline" size={20} color="#fff" /></SettingIconContainer>
            <SettingTextContainer><SettingTitle>{T.terms_conditions}</SettingTitle></SettingTextContainer>
            <SettingAction><Ionicons name="open-outline" size={22} color="#c7c7cc" /></SettingAction>
          </SettingRow>
          <SettingRow activeOpacity={1}>
             <SettingIconContainer color="#333"><FontAwesome5 name="code-branch" size={16} color="#fff" /></SettingIconContainer>
            <SettingTextContainer><SettingTitle>{T.app_version}</SettingTitle></SettingTextContainer>
            <SettingAction><VersionText>{APP_VERSION}</VersionText></SettingAction>
          </SettingRow>
        </Section>

        <LogoutButton onPress={confirmarCerrarSesion}>
          <LogoutButtonText>{T.logout_button}</LogoutButtonText>
        </LogoutButton>
      </Scroll>
    </Container>
  );
};

export default AjustesScreen;