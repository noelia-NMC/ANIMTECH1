import styled from 'styled-components/native';
import MapView from 'react-native-maps';

export const Container = styled.View`
  flex: 1;
  background-color: #f5ffff;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  color: #239089;
`;

export const StyledMap = styled(MapView)`
  flex: 1;
`;

export const InfoBox = styled.View`
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  margin: 10px;
  elevation: 5;
`;

export const DescriptionText = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

export const AcceptButton = styled.TouchableOpacity`
  background-color: #42a8a1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
  margin-right: 5px;
`;

export const DeclineButton = styled.TouchableOpacity`
  background-color: #f0ad4e;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
  margin-left: 5px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const RescatesList = styled.View`
  max-height: 150px;
  background-color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 10px;
  elevation: 5;
`;

export const RescateItem = styled.TouchableOpacity`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const RescateDescription = styled.Text`
  color: #333;
`;

export const NoRescatesText = styled.Text`
  text-align: center;
  padding: 20px;
  color: #888;
`;