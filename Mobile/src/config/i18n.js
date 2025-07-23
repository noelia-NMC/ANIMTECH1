// src/config/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Recursos de idioma
const resources = {
  es: {
    translation: {
      settings: {
        title: "Ajustes",
        notifications_section: "Notificaciones",
        event_reminders: "Recordatorios de eventos",
        new_rescues: "Nuevos rescates cerca",
        preferences_section: "Preferencias",
        language: "Idioma",
        language_subtitle: "Selecciona el idioma de la app",
        appearance: "Apariencia",
        appearance_subtitle: "Personaliza los colores de la app",
        temperature_units: "Unidades de temperatura",
        community_section: "Comunidad y soporte",
        contact_support: "Contactar con soporte",
        contact_support_subtitle: "Envíanos tus dudas o problemas",
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
        coming_soon_message: "La función de \"{{feature}}\" estará disponible muy pronto.",
        error_alert: "Error",
        error_open_link: "No se pudo abrir el enlace.",
        error_open_mail: "No se pudo abrir la app de correo."
      },
      home: {
        greeting: "¡Hola, {{name}}!",
        howAreYou: "¿Cómo te sientes hoy?"
      }
    }
  },
  en: {
    translation: {
      settings: {
        title: "Settings",
        notifications_section: "Notifications",
        event_reminders: "Event reminders",
        new_rescues: "New rescues nearby",
        preferences_section: "Preferences",
        language: "Language",
        language_subtitle: "Select the app language",
        appearance: "Appearance",
        appearance_subtitle: "Customize the app's colors",
        temperature_units: "Temperature units",
        community_section: "Community & Support",
        contact_support: "Contact support",
        contact_support_subtitle: "Send us your questions or issues",
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
        coming_soon_message: "The \"{{feature}}\" feature will be available very soon.",
        error_alert: "Error",
        error_open_link: "Could not open the link.",
        error_open_mail: "Could not open the mail app."
      },
      home: {
        greeting: "Hello, {{name}}!",
        howAreYou: "How are you feeling today?"
      }
    }
  }
};

// Configuración de i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;