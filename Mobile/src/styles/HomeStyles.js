import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { View } from 'react-native';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  extra: '#b5ffff',
  background: '#f9f9f9',
  white: '#ffffff',
  black: '#000000',
  textPrimary: '#222222',
  textSecondary: '#666666',
  lightGray: '#f0f0f0',
};

export const CenteredContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const GradientHeader = styled(LinearGradient)`
  padding-top: 50px;
  padding-bottom: 30px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const HeaderContent = styled.View`
  padding-horizontal: 20px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const MenuButton = styled.TouchableOpacity`
  padding: 5px;
`;

export const HeaderTitle = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: ${colors.white};
  letter-spacing: 1px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

export const HeaderSubtitle = styled.Text`
  font-size: 15px;
  color: ${colors.white};
  opacity: 0.9;
  margin-left: 5px;
`;

export const Content = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 120,
  },
}))``;

export const WelcomeSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
`;

export const WelcomeMessage = styled.Text`
  font-size: 18px;
  color: ${colors.textSecondary};
`;

export const WelcomeName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.textPrimary};
`;

export const PetAvatarContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${colors.white};
  elevation: 5;
  shadow-color: ${colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${colors.accent};
`;

export const PetAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

export const LastCheckedSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

export const LastCheckedTitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-right: 5px;
`;

export const LastCheckedTime = styled.Text`
  font-size: 14px;
  color: ${colors.primary};
  font-weight: 600;
`;

export const StatusContainer = styled.View`
  flex-direction: row;
  background-color: ${colors.white};
  border-radius: 20px;
  padding-vertical: 15px;
  margin-bottom: 25px;
  shadow-color: ${colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

export const StatusItem = styled.View`
  flex: 1;
  align-items: center;
  border-right-width: ${props => props.noBorder ? '0' : '1px'};
  border-right-color: ${colors.lightGray};
`;

export const StatusValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.primary};
  margin-bottom: 4px;
`;

export const StatusLabel = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
`;

export const CardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Card = styled.TouchableOpacity`
  width: ${(width - 50) / 2}px;
  background-color: ${colors.white};
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  shadow-color: ${colors.black};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 6;
`;

export const CardGradient = styled(LinearGradient)`
  height: 90px;
  justify-content: center;
  align-items: center;
`;

export const CardIcon = styled.View`
  width: 55px;
  height: 55px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.25);
  align-items: center;
  justify-content: center;
`;

export const CardContent = styled.View`
  padding: 15px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
`;

export const CardDescription = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
`;

export const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
`;

export const BottomNavigation = styled.View`
  flex-direction: row;
  background-color: ${colors.white};
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  shadow-color: ${colors.black};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 10;
  width: 100%;
`;

export const NavButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding-vertical: 10px;
`;

export const NavButtonText = styled.Text`
  font-size: 12px;
  margin-top: 3px;
  color: ${props => props.active ? colors.primary : colors.textSecondary};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

export const QuickActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${colors.primary};
  align-items: center;
  justify-content: center;
  shadow-color: ${colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 8;
`;

export const ButtonNotch = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
`;

export const NotificationBadge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff5252;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #fff;
`;

export const NotificationText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: bold;
`;