import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ConnectionScreen from './ConnectionScreen';
import ControlScreen from './ControlScreen';

export default function RobotControl() {
  const [ipAddress, setIpAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const connectToRobot = () => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipAddress || !ipRegex.test(ipAddress)) {
      Alert.alert('Error', 'Ingrese una dirección IP válida');
      return;
    }

    const newWs = new WebSocket(`ws://${ipAddress}:8000`);

    newWs.onopen = () => {
      setConnected(true);
      setWs(newWs);
      setIsConnecting(false);
      Alert.alert('Éxito', 'Conectado al robot');
    };

    newWs.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      Alert.alert('Error', 'Error al establecer conexión');
    };

    newWs.onclose = () => {
      setConnected(false);
      setWs(null);
      setIsConnecting(true);
      Alert.alert('Desconectado', 'Conexión cerrada');
    };
  };

  const sendCommand = (command: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ command }));
    } else {
      Alert.alert('Error', 'Robot no conectado');
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  if (isConnecting) {
    return (
      <ConnectionScreen
        ipAddress={ipAddress}
        setIpAddress={setIpAddress}
        connectToRobot={connectToRobot}
      />
    );
  }

  return (
    <ControlScreen
      connected={connected}
      sendCommand={sendCommand}
    />
  );
}
