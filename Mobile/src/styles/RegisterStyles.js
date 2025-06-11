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
  padding: 10px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 5px;
  z-index: 1;
`;

export const PageTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #239089;
  text-align: center;
  flex: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
`;

export const StepsIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

export const StepDot = styled.View`
  width: ${props => props.active ? '30px' : '10px'};
  height: 10px;
  border-radius: 10px;
  background-color: ${props => props.color || (props.active ? '#239089' : 'rgba(35, 144, 137, 0.3)')};
  margin: 0 5px;
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

export const Button = styled.TouchableOpacity`
  background-color: #42a8a1;
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 4;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

export const SecurityNote = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 5px 10px;
  background-color: rgba(93, 193, 185, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const SecurityNoteText = styled.Text`
  font-size: 12px;
  color: #5dc1b9;
  margin-left: 8px;
  flex: 1;
`;

export const LinkText = styled.Text`
  margin-top: 20px;
  color: #239089;
  font-size: 16px;
  text-align: center;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;