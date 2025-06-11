import styled from 'styled-components/native';
import MapView from 'react-native-maps';

export const Container = styled.View`
  flex: 1;
  background-color: #f0fdfc;
`;

export const StyledMap = styled(MapView)`
  flex: 1;
`;

export const Input = styled.TextInput`
  background-color: white;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
`;

export const Button = styled.TouchableOpacity`
  background-color: #42a8a1;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

export const LoadingText = styled.Text`
  margin-top: 100px;
  text-align: center;
  font-size: 18px;
`;
