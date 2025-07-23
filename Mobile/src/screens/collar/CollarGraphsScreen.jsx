import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebaseConfig';
import {
  Container, ChartContainer, ChartTitle,
  SimpleChart, ChartBar, ChartLabel, ChartValue,
  LineChart, LinePoint, LinePath,
  HistoryContainer, HistoryItem, HistoryTime, HistoryData,
  SectionTitle, InfoSection
} from '../../styles/CollarStyles';

const screenWidth = Dimensions.get('window').width;

const CollarGraphsScreen = () => {
  const [historialDatos, setHistorialDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const procesarTemperatura = (temp) => {
    return Number(temp) / 100 || 0;
  };

  const interpretarComportamiento = (nivel) => {
    const nivelNum = Number(nivel) || 0;
    if (nivelNum <= 15) return 'Durmiendo';
    if (nivelNum <= 30) return 'Relajado';
    if (nivelNum <= 45) return 'Activo';
    if (nivelNum <= 60) return 'Comunicativo';
    if (nivelNum <= 75) return 'Alerta';
    if (nivelNum <= 90) return 'Estresado';
    return 'Muy alterado';
  };

  const cargarHistorial = () => {
    try {
      const collarRef = ref(db, 'AnimTech/device01');
      
      const unsubscribe = onValue(collarRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const timestamp = new Date().toLocaleTimeString().slice(0, 5);
          const tempMascota = procesarTemperatura(data.temperatura?.mascota || 0);
          const tempAmbiente = procesarTemperatura(data.temperatura?.ambiente || 0);
          const nivelSonido = Number(data.sonido) || 0;
          
          const nuevoDato = {
            tiempo: timestamp,
            tempMascota: tempMascota,
            tempAmbiente: tempAmbiente,
            diferencia: tempMascota - tempAmbiente,
            sonido: nivelSonido,
            comportamiento: interpretarComportamiento(nivelSonido),
            timestamp: new Date().toLocaleString()
          };

          setHistorialDatos(prev => {
            const nuevo = [...prev, nuevoDato];
            return nuevo.slice(-20); // Mantener últimos 20 registros
          });
        }
        setCargando(false);
        setRefreshing(false);
        setError(null);
      }, (error) => {
        console.error('Error cargando historial:', error);
        setError('Error al cargar datos');
        setCargando(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error conectando:', err);
      setError('Error de conexión');
      setCargando(false);
      setRefreshing(false);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = cargarHistorial();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setHistorialDatos([]);
    cargarHistorial();
  }, []);

  // Componente para gráfico de líneas
  const SimpleLineChart = ({ data, title, color = '#42a8a1', dataKey = 'valor' }) => {
    if (!data || data.length === 0) {
      return (
        <ChartContainer>
          <ChartTitle>{title}</ChartTitle>
          <Text style={{ textAlign: 'center', color: '#6c757d', padding: 30, fontSize: 14 }}>
            No hay datos disponibles
          </Text>
        </ChartContainer>
      );
    }

    const valores = data.map(item => item[dataKey] || 0);
    const maxValue = Math.max(...valores);
    const minValue = Math.min(...valores);
    const range = maxValue - minValue || 1;
    
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontSize: 12, color: '#28a745', fontWeight: '600' }}>
              Máx: {maxValue.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: '#dc3545', fontWeight: '600' }}>
              Mín: {minValue.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: '#6c757d', fontWeight: '600' }}>
              Prom: {(valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1)}
            </Text>
          </View>
        </View>
        
        <LineChart>
          {data.slice(-10).map((item, index) => {
            const height = ((item[dataKey] || 0) - minValue) / range * 100 + 10;
            const leftPosition = (index / (data.slice(-10).length - 1)) * 100;
            
            return (
              <LinePoint 
                key={index}
                color={color}
                style={{
                  left: `${leftPosition}%`,
                  bottom: `${height}%`
                }}
              />
            );
          })}
        </LineChart>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 10 }}>
          {data.slice(-10).map((item, index) => (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 10, color: '#6c757d' }}>{item.tiempo}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#212529' }}>
                {dataKey === 'diferencia' ? 
                  `${(item[dataKey] || 0).toFixed(1)}°C` : 
                  dataKey === 'sonido' ?
                  `${item[dataKey] || 0}%` :
                  `${(item[dataKey] || 0).toFixed(1)}°C`
                }
              </Text>
            </View>
          ))}
        </View>
      </ChartContainer>
    );
  };

  // Componente para gráfico de barras
  const SimpleBarChart = ({ data, title, color = '#42a8a1', dataKey = 'valor' }) => {
    if (!data || data.length === 0) {
      return (
        <ChartContainer>
          <ChartTitle>{title}</ChartTitle>
          <Text style={{ textAlign: 'center', color: '#6c757d', padding: 30, fontSize: 14 }}>
            No hay datos disponibles
          </Text>
        </ChartContainer>
      );
    }

    const valores = data.map(item => item[dataKey] || 0);
    const maxValue = Math.max(...valores);
    const minValue = Math.min(...valores);
    const range = maxValue - minValue || 1;
    
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontSize: 12, color: '#28a745', fontWeight: '600' }}>
              Máx: {maxValue.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: '#dc3545', fontWeight: '600' }}>
              Mín: {minValue.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: '#6c757d', fontWeight: '600' }}>
              Prom: {(valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1)}
            </Text>
          </View>
        </View>
        
        <SimpleChart>
          {data.slice(-8).map((item, index) => (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <ChartBar 
                color={color}
                height={Math.max(((item[dataKey] || 0) - minValue) / range * 120 + 15, 8)}
              />
              <ChartLabel>{item.tiempo}</ChartLabel>
              <ChartValue>
                {dataKey === 'diferencia' ? 
                  `${(item[dataKey] || 0).toFixed(1)}°C` : 
                  dataKey === 'sonido' ?
                  `${item[dataKey] || 0}%` :
                  `${(item[dataKey] || 0).toFixed(1)}°C`
                }
              </ChartValue>
            </View>
          ))}
        </SimpleChart>
      </ChartContainer>
    );
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={{ marginTop: 15, fontSize: 16, color: '#6c757d', fontWeight: '500' }}>
          Cargando historial de datos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#dc3545', marginBottom: 10, fontWeight: '600' }}>Error</Text>
        <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Container>
        {/* SECCIÓN DE TEMPERATURA */}
        <InfoSection>
          <SectionTitle>📊 Análisis de Temperatura</SectionTitle>
        </InfoSection>

        {/* GRÁFICO DE LÍNEAS - TEMPERATURA CORPORAL */}
        <SimpleLineChart 
          data={historialDatos} 
          title="Temperatura Corporal (Líneas)"
          color="#dc3545"
          dataKey="tempMascota"
        />

        {/* GRÁFICO DE BARRAS - TEMPERATURA AMBIENTE */}
        <SimpleBarChart 
          data={historialDatos} 
          title="Temperatura Ambiente (Barras)"
          color="#17a2b8"
          dataKey="tempAmbiente"
        />

        {/* GRÁFICO DE LÍNEAS - DIFERENCIA TÉRMICA */}
        <SimpleLineChart 
          data={historialDatos} 
          title="Diferencia Térmica (Líneas)"
          color="#fd7e14"
          dataKey="diferencia"
        />

        {/* SECCIÓN DE COMPORTAMIENTO */}
        <InfoSection style={{ marginTop: 20 }}>
          <SectionTitle>🎵 Análisis de Comportamiento</SectionTitle>
        </InfoSection>

        {/* GRÁFICO DE BARRAS - NIVEL DE SONIDO */}
        <SimpleBarChart 
          data={historialDatos} 
          title="Nivel de Audio/Comportamiento (Barras)"
          color="#6f42c1"
          dataKey="sonido"
        />

        {/* RESUMEN ESTADÍSTICO */}
        {historialDatos.length > 0 && (
          <InfoSection style={{ marginTop: 20 }}>
            <SectionTitle>📈 Estadísticas del Período</SectionTitle>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between',
              marginTop: 15
            }}>
              <View style={{ 
                width: '48%', 
                backgroundColor: '#fff', 
                padding: 15, 
                borderRadius: 12, 
                alignItems: 'center',
                marginBottom: 10,
                elevation: 2
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#dc3545' }}>
                  {(historialDatos.reduce((acc, item) => acc + item.tempMascota, 0) / historialDatos.length).toFixed(1)}°C
                </Text>
                <Text style={{ fontSize: 12, color: '#6c757d', textAlign: 'center' }}>Temp. Promedio</Text>
              </View>
              
              <View style={{ 
                width: '48%', 
                backgroundColor: '#fff', 
                padding: 15, 
                borderRadius: 12, 
                alignItems: 'center',
                marginBottom: 10,
                elevation: 2
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6f42c1' }}>
                  {Math.round(historialDatos.reduce((acc, item) => acc + item.sonido, 0) / historialDatos.length)}%
                </Text>
                <Text style={{ fontSize: 12, color: '#6c757d', textAlign: 'center' }}>Audio Promedio</Text>
              </View>
              
              <View style={{ 
                width: '48%', 
                backgroundColor: '#fff', 
                padding: 15, 
                borderRadius: 12, 
                alignItems: 'center',
                elevation: 2
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fd7e14' }}>
                  {(historialDatos.reduce((acc, item) => acc + item.diferencia, 0) / historialDatos.length).toFixed(1)}°C
                </Text>
                <Text style={{ fontSize: 12, color: '#6c757d', textAlign: 'center' }}>Dif. Térmica Prom.</Text>
              </View>
              
              <View style={{ 
                width: '48%', 
                backgroundColor: '#fff', 
                padding: 15, 
                borderRadius: 12, 
                alignItems: 'center',
                elevation: 2
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#28a745' }}>
                  {historialDatos.length}
                </Text>
                <Text style={{ fontSize: 12, color: '#6c757d', textAlign: 'center' }}>Total Registros</Text>
              </View>
            </View>
          </InfoSection>
        )}

        {/* HISTORIAL DETALLADO CON SCROLL */}
        <HistoryContainer style={{ maxHeight: 300 }}>
          <ChartTitle>Registros Detallados</ChartTitle>
          <ScrollView 
            style={{ maxHeight: 240 }} 
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {historialDatos.length > 0 ? (
              historialDatos.slice().reverse().map((item, index) => (
                <HistoryItem key={index}>
                  <View style={{ flex: 1 }}>
                    <HistoryTime>{item.tiempo}</HistoryTime>
                    <Text style={{ fontSize: 11, color: '#6c757d' }}>{item.timestamp}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <HistoryData style={{ fontSize: 13 }}>
                      🌡️ {item.tempMascota.toFixed(1)}°C | 🏠 {item.tempAmbiente.toFixed(1)}°C
                    </HistoryData>
                    <HistoryData style={{ fontSize: 13 }}>
                      🔊 {item.sonido}% - {item.comportamiento}
                    </HistoryData>
                  </View>
                </HistoryItem>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: '#6c757d', padding: 20, fontSize: 14 }}>
                No hay registros disponibles
              </Text>
            )}
          </ScrollView>
        </HistoryContainer>
      </Container>
    </ScrollView>
  );
};

export default CollarGraphsScreen;