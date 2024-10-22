import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RobotControlScreen() {
  const [ipAddress, setIpAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true); // Estado para manejar la pantalla de conexión

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
      setIsConnecting(false); // Cambiamos a la pantalla de control
      Alert.alert('Éxito', 'Conectado al robot');
    };

    newWs.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      Alert.alert('Error', 'Error al establecer conexión');
    };

    newWs.onclose = () => {
      setConnected(false);
      setWs(null);
      setIsConnecting(true); // Volvemos a la pantalla de conexión si se desconecta
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

  // Pantalla de conexión
  const renderConnectionScreen = () => (
    <ThemedView style={styles.containerIP}>
      <ThemedText style={styles.title}>Conectar al Robot</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la IP del servidor"
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="default"
      />
      <TouchableOpacity style={styles.button} onPress={connectToRobot}>
        <ThemedText style={styles.buttonText}>Conectar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  // Pantalla de control
  const renderControlScreen = () => (
    <ThemedView style={styles.container}>
      <ThemedView>
        <ThemedText style={styles.status}>
          {connected ? 'Conectado' : 'Desconectado'}
        </ThemedText>
        <ThemedView>
          {/* aqui ir un boton para encedender y apagar una cierra */}
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPressIn={() => sendCommand('forward')}
          onPressOut={() => sendCommand('stop')}
        >
          <Image
            source={require('./../../assets/images/arrow-up.png')}
            style={styles.controlICon}
          ></Image>
        </TouchableOpacity>
        <ThemedView style={styles.middleControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => sendCommand('left')}
            onPressOut={() => sendCommand('stop')}
          >
            <Image
              source={require('./../../assets/images/arrow-left.png')}
              style={styles.controlICon}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => sendCommand('right')}
            onPressOut={() => sendCommand('stop')}
          >
            <Image
              source={require('./../../assets/images/arrow-right.png')}
              style={styles.controlICon}
            ></Image>
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity
          style={styles.controlButton}
          onPressIn={() => sendCommand('backward')}
          onPressOut={() => sendCommand('stop')}
        >

          <Image
            source={require('./../../assets/images/arrow-down.png')}
            style={styles.controlICon}
          ></Image>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
  return isConnecting ? renderConnectionScreen() : renderControlScreen();
}

const styles = StyleSheet.create({

  containerIP: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white'

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
    padding: 5
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  middleControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'white'
  },
  controlButton: {
    backgroundColor: '#181C14',
    padding: 15,
    borderRadius: 5,
    width: '40%',
    marginVertical: 5,
    alignItems: 'center'
  },
  controlICon: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }
  ,
  status: {
    marginTop: 20,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
    color: 'red'
  },
});



