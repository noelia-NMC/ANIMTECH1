import React, { useState, useEffect } from 'react';
import { View, Switch, Slider } from 'react-native';
import styled from 'styled-components/native';
import { ref, set } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import collarService from '../services/colarService';

const SimulatorContainer = styled.View`
  background-color: white;
  margin: 15px;
  border-radius: 12px;
  padding: 15px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #555;
  flex: 1;
`;

const Value = styled.Text`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  width: 60px;
  text-align: right;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ secondary }) => (secondary ? '#27ae60' : '#3498db')};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  color: ${({ success }) => (success ? '#27ae60' : '#e74c3c')};
  font-style: italic;
  margin-top: 10px;
  text-align: center;
`;

const CollarSimulator = () => {
  const [autoMode, setAutoMode] = useState(false);
  const [temperature, setTemperature] = useState(38.5);
  const [pulse, setPulse] = useState(80);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let interval;

    if (autoMode) {
      simulateData(); // Ejecutar una vez
      interval = setInterval(simulateData, 30000); // Cada 30 segundos
    }

    return () => clearInterval(interval);
  }, [autoMode]);

  const simulateData = async () => {
    try {
      setStatus('Enviando datos simulados...');

      if (autoMode) {
        const result = await collarService.simulateCollarData();
        setStatus(`✅ ${result.temperatura}°C, ${result.pulso} bpm ${result.generatedAlert ? '⚠️ ¡Alerta!' : ''}`);
      } else {
        const timestamp = new Date().toLocaleString();

        await set(ref(db, 'collares/collar_001'), {
          temperatura: Number(temperature),
          pulso: Number(pulse),
          timestamp
        });

        await collarService.saveReading(Number(temperature), Number(pulse));

        const vital = collarService.checkVitalSigns(temperature, pulse);
        const alertNeeded = vital.temperature.status !== 'normal' || vital.pulse.status !== 'normal';

        if (alertNeeded) {
          const msg = [vital.temperature.message, vital.pulse.message].filter(Boolean).join(' y ');
          await collarService.createAlert(temperature, pulse, msg);
          setStatus(`✅ ${temperature}°C, ${pulse} bpm ⚠️ ¡Alerta generada!`);
        } else {
          setStatus(`✅ ${temperature}°C, ${pulse} bpm`);
        }
      }

      if (!autoMode) {
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error en simulación:', error);
      setStatus('❌ Error al enviar datos');
      if (!autoMode) setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <SimulatorContainer>
      <Title>Simulador de Collar</Title>
      <Description>
        Usa este simulador para enviar datos mientras conectas tu prototipo real.
      </Description>

      <Row>
        <Label>Modo automático</Label>
        <Switch
          value={autoMode}
          onValueChange={setAutoMode}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={autoMode ? '#3498db' : '#f4f3f4'}
        />
      </Row>

      {!autoMode && (
        <>
          <Row>
            <Label>Temperatura (°C)</Label>
            <Slider
              style={{ flex: 1 }}
              minimumValue={36}
              maximumValue={42}
              step={0.1}
              value={temperature}
              onValueChange={setTemperature}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#ddd"
            />
            <Value>{temperature.toFixed(1)}</Value>
          </Row>

          <Row>
            <Label>Pulso (bpm)</Label>
            <Slider
              style={{ flex: 1 }}
              minimumValue={40}
              maximumValue={200}
              step={1}
              value={pulse}
              onValueChange={setPulse}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#ddd"
            />
            <Value>{Math.round(pulse)}</Value>
          </Row>

          <Button onPress={simulateData}>
            <ButtonText>Enviar datos</ButtonText>
          </Button>
        </>
      )}

      {autoMode && (
        <Button onPress={simulateData} secondary>
          <ButtonText>Simular ahora</ButtonText>
        </Button>
      )}

      {status && (
        <StatusText success={status.includes('✅')}>
          {status}
        </StatusText>
      )}
    </SimulatorContainer>
  );
};

export default CollarSimulator;
