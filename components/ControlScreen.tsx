import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { ThemedView } from './ThemedView';

interface ControlScreenProps {
  connected: boolean;
  sendCommand: (command: string) => void;
}

export default function ControlScreen({ sendCommand }: ControlScreenProps) {

  const [isSawOn, setIsSawOn] = useState(false);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotationAnim.setValue(0)
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotationAnim.stopAnimation(() => {
      rotationAnim.setValue(0)
    })
  };

  const toggleSaw = () => {
    if (isSawOn) {
      sendCommand('turnOffSaw');
      stopRotation();
    } else {
      sendCommand('turnOnSaw');
      startRotation();
    }
    setIsSawOn(!isSawOn);
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <ThemedView style={styles.container}>


      <ThemedView style={styles.btnContainer}>

        <TouchableOpacity
          style={styles.btnOnOff}
          onPressIn={() => sendCommand('onOff')}
        >
          <Image
            source={require('../assets/images/onOff.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={isSawOn ? styles.sawButtonActive : styles.sawButton}
          onPress={toggleSaw}
        >
          <Animated.Image
            source={require('../assets/images/Saw.png')}
            style={[
              styles.sawIcon,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          />
        </TouchableOpacity>


      </ThemedView>
      <ThemedView style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPressIn={() => sendCommand('forward')}
          onPressOut={() => sendCommand('stop')}
        >
          <Image
            source={require('../assets/images/arrow-up.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>
        <ThemedView style={styles.middleControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => sendCommand('left')}
            onPressOut={() => sendCommand('stop')}
          >
            <Image
              source={require('../assets/images/arrow-left.png')}
              style={styles.controlIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => sendCommand('right')}
            onPressOut={() => sendCommand('stop')}
          >
            <Image
              source={require('../assets/images/arrow-right.png')}
              style={styles.controlIcon}
            />
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity
          style={styles.controlButton}
          onPressIn={() => sendCommand('backward')}
          onPressOut={() => sendCommand('stop')}
        >
          <Image
            source={require('../assets/images/arrow-down.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white'
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 30
  },
  sawButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '8%',
    marginVertical: 5,
    alignItems: 'center',
    color: 'white'
  },
  btnOnOff: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5
  },
  sawButtonActive: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '8%',
    marginVertical: 5,
    alignItems: 'center',
    color: 'white',
  }, sawIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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
  controlIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  status: {
    marginTop: 20,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
    color: 'red'
  },
});
