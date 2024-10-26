import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ConnectionScreenProps {
  ipAddress: string;
  setIpAddress: (ip: string) => void;
  connectToRobot: () => void;
}

export default function ConnectionScreen({ ipAddress, setIpAddress, connectToRobot }: ConnectionScreenProps) {
  return (
    <ThemedView style={styles.container}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
