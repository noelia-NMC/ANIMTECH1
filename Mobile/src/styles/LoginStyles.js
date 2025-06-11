import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  flex: 1;
`;

export const GradientBackground = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ContentContainer = styled.View`
  width: 100%;
  max-width: 400px;
  align-items: center;
  padding: 20px;
`;

export const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

export const Logo = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.7);
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #239089;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
`;

export const FormContainer = styled.View`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

export const InputLabel = styled.Text`
  font-size: 14px;
  color: #239089;
  margin-bottom: 5px;
  font-weight: 600;
  margin-left: 4px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0ffff;
  border-radius: 10px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${props => props.isFocused ? '#239089' : '#dfeeee'};
  overflow: hidden;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 12px 10px;
  font-size: 16px;
  color: #333;
`;

export const IconContainer = styled.View`
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

export const ButtonContainer = styled.View`
  margin-top: 20px;
  width: 100%;
`;

export const Button = styled.TouchableOpacity`
  background-color: #42a8a1;
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 4;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

export const LinkText = styled.Text`
  margin-top: 20px;
  color: #239089;
  font-size: 16px;
  text-align: center;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;

export const ForgotPasswordText = styled.Text`
  color: #5dc1b9;
  font-size: 14px;
  text-align: right;
  margin-bottom: 10px;
  align-self: flex-end;
`;