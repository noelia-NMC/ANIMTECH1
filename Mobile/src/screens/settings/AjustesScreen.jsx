// src/screens/perfil/AjustesScreen.jsx

import React from 'react';
import { Switch, Alert, Linking } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import {
  Container, Header, BackButton, HeaderTitle, Scroll,
  Section, SectionTitle, SettingRow, SettingIconContainer,
  SettingTextContainer, SettingTitle, SettingSubtitle,
  SettingAction, VersionText, LogoutButton, LogoutButtonText,
  UnitsSelector, UnitOption, UnitText
} from '../../styles/AjustesStyles';

const AjustesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { settings, updateLanguage, updateNotification, updateTemperatureUnit } = useSettings();
  
  const APP_VERSION = "1.0.3";

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'welcomeShown']);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(t('settings.error_alert'), "No se pudo cerrar la sesión.");
    }
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      t('settings.logout_confirm_title'), 
      t('settings.logout_confirm_message'),
      [
        { text: t('settings.cancel'), style: 'cancel' }, 
        { text: t('settings.yes_logout'), onPress: cerrarSesion, style: 'destructive' }
      ]
    );
  };
  
  const showComingSoonAlert = (feature) => {
    Alert.alert(t('settings.coming_soon_title'), t('settings.coming_soon_message', { feature }));
  };

  const contactSupport = () => {
    Linking.openURL('mailto:soporte@animtech.com?subject=Ayuda%20desde%20la%20App')
      .catch(() => Alert.alert(t('settings.error_alert'), t('settings.error_open_mail')));
  };

  const proposeFeature = () => {
    Linking.openURL('mailto:ideas@animtech.com?subject=Propuesta%20de%20Nueva%20Función')
      .catch(() => Alert.alert(t('settings.error_alert'), t('settings.error_open_mail')));
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </BackButton>
        <HeaderTitle>{t('settings.title')}</HeaderTitle>
      </Header>

      <Scroll showsVerticalScrollIndicator={false}>
        {/* NOTIFICACIONES */}
        <Section>
          <SectionTitle>{t('settings.notifications_section')}</SectionTitle>
          
          <SettingRow activeOpacity={1}>
            <SettingIconContainer color="#007aff">
              <Ionicons name="calendar" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.event_reminders')}</SettingTitle>
            </SettingTextContainer>
            <SettingAction>
              <Switch 
                value={settings.notifications.eventos} 
                onValueChange={(value) => updateNotification('eventos', value)} 
                trackColor={{false: '#d1d1d6', true: '#34c759'}}
              />
            </SettingAction>
          </SettingRow>

          <SettingRow activeOpacity={1}>
            <SettingIconContainer color="#5ac8fa">
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.new_rescues')}</SettingTitle>
            </SettingTextContainer>
            <SettingAction>
              <Switch 
                value={settings.notifications.rescates} 
                onValueChange={(value) => updateNotification('rescates', value)} 
                trackColor={{false: '#d1d1d6', true: '#34c759'}}
              />
            </SettingAction>
          </SettingRow>
        </Section>
        
        {/* PREFERENCIAS */}
        <Section>
          <SectionTitle>{t('settings.preferences_section')}</SectionTitle>
          
          <SettingRow>
            <SettingIconContainer color="#333">
              <Ionicons name="language" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.language')}</SettingTitle>
              <SettingSubtitle>{t('settings.language_subtitle')}</SettingSubtitle>
            </SettingTextContainer>
            <SettingAction>
              <UnitsSelector>
                <UnitOption 
                  active={settings.language === 'es'} 
                  onPress={() => updateLanguage('es')}
                >
                  <UnitText active={settings.language === 'es'}>ES</UnitText>
                </UnitOption>
                <UnitOption 
                  active={settings.language === 'en'} 
                  onPress={() => updateLanguage('en')}
                >
                  <UnitText active={settings.language === 'en'}>EN</UnitText>
                </UnitOption>
              </UnitsSelector>
            </SettingAction>
          </SettingRow>

          <SettingRow onPress={() => showComingSoonAlert(t('settings.appearance'))}>
            <SettingIconContainer color="#8e8e93">
              <Ionicons name="contrast" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.appearance')}</SettingTitle>
              <SettingSubtitle>{t('settings.appearance_subtitle')}</SettingSubtitle>
            </SettingTextContainer>
            <SettingAction>
              <Ionicons name="chevron-forward" size={22} color="#c7c7cc" />
            </SettingAction>
          </SettingRow>

          <SettingRow activeOpacity={1}>
            <SettingIconContainer color="#ff9500">
              <MaterialCommunityIcons name="temperature-celsius" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.temperature_units')}</SettingTitle>
            </SettingTextContainer>
            <SettingAction>
              <UnitsSelector>
                <UnitOption 
                  active={settings.units.temperature === 'C'} 
                  onPress={() => updateTemperatureUnit('C')}
                >
                  <UnitText active={settings.units.temperature === 'C'}>°C</UnitText>
                </UnitOption>
                <UnitOption 
                  active={settings.units.temperature === 'F'} 
                  onPress={() => updateTemperatureUnit('F')}
                >
                  <UnitText active={settings.units.temperature === 'F'}>°F</UnitText>
                </UnitOption>
              </UnitsSelector>
            </SettingAction>
          </SettingRow>
        </Section>
        
        {/* COMUNIDAD Y SOPORTE */}
        <Section>
          <SectionTitle>{t('settings.community_section')}</SectionTitle>
          
          <SettingRow onPress={contactSupport}>
            <SettingIconContainer color="#34c759">
              <Ionicons name="send-outline" size={18} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.contact_support')}</SettingTitle>
              <SettingSubtitle>{t('settings.contact_support_subtitle')}</SettingSubtitle>
            </SettingTextContainer>
          </SettingRow>

          <SettingRow onPress={proposeFeature}>
            <SettingIconContainer color="#ffcc00">
              <Ionicons name="bulb-outline" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.propose_feature')}</SettingTitle>
              <SettingSubtitle>{t('settings.propose_feature_subtitle')}</SettingSubtitle>
            </SettingTextContainer>
          </SettingRow>
        </Section>
        
        {/* ACERCA DE */}
        <Section>
          <SectionTitle>{t('settings.about_section')}</SectionTitle>
          
          <SettingRow onPress={() => Linking.openURL('https://animtech.com/terms').catch(() => Alert.alert(t('settings.error_alert'), t('settings.error_open_link')))}>
            <SettingIconContainer color="#a0aec0">
              <Ionicons name="document-text-outline" size={20} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.terms_conditions')}</SettingTitle>
            </SettingTextContainer>
            <SettingAction>
              <Ionicons name="open-outline" size={22} color="#c7c7cc" />
            </SettingAction>
          </SettingRow>

          <SettingRow activeOpacity={1}>
            <SettingIconContainer color="#333">
              <FontAwesome5 name="code-branch" size={16} color="#fff" />
            </SettingIconContainer>
            <SettingTextContainer>
              <SettingTitle>{t('settings.app_version')}</SettingTitle>
            </SettingTextContainer>
            <SettingAction>
              <VersionText>{APP_VERSION}</VersionText>
            </SettingAction>
          </SettingRow>
        </Section>

        <LogoutButton onPress={confirmarCerrarSesion}>
          <LogoutButtonText>{t('settings.logout_button')}</LogoutButtonText>
        </LogoutButton>
      </Scroll>
    </Container>
  );
};

export default AjustesScreen;