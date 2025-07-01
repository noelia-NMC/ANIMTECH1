// src/styles/AjustesStyles.js

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f7;
`;

export const Header = styled.View`
  padding: 20px;
  padding-top: 30px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 20px;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
`;

export const Scroll = styled.ScrollView.attrs({
    contentContainerStyle: {
        paddingBottom: 40,
    }
})`
  flex: 1;
`;

export const Section = styled.View`
  margin-top: 25px;
`;

export const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #8e8e93;
  margin-left: 18px;
  margin-bottom: 8px;
`;

export const SettingRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 14px 18px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  min-height: 55px;
`;

export const SettingIconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  background-color: ${({ color }) => color || '#42a8a1'};
`;

export const SettingTextContainer = styled.View`
  flex: 1;
`;

export const SettingTitle = styled.Text`
  font-size: 16px;
  color: #000;
`;

export const SettingSubtitle = styled.Text`
  font-size: 13px;
  color: #888;
  margin-top: 3px;
`;

export const SettingAction = styled.View`
  justify-content: center;
  align-items: center;
`;

// Nuevos estilos para el selector de unidades
export const UnitsSelector = styled.View`
  flex-direction: row;
  background-color: #e9e9eb;
  border-radius: 8px;
  padding: 2px;
`;

export const UnitOption = styled.TouchableOpacity`
  padding: 5px 12px;
  border-radius: 7px;
  background-color: ${({ active }) => (active ? '#ffffff' : 'transparent')};
  elevation: ${({ active }) => (active ? 1 : 0)};
`;

export const UnitText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#007aff' : '#3c3c43')};
`;

export const VersionText = styled.Text`
  font-size: 16px;
  color: #8e8e93;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin: 30px 18px;
  padding: 15px;
  background-color: #fff;
  border-radius: 12px;
  align-items: center;
`;

export const LogoutButtonText = styled.Text`
  color: #ff3b30;
  font-size: 16px;
  font-weight: 600;
`;