/**
 * RemoteButton — A single pressable remote control button with
 * animated press feedback and status indicators.
 */

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';

const RemoteButton = ({
  label,
  icon,
  color = '#0A84FF',
  isPrimary = false,
  isSending = false,
  onPress,
  style,
}) => {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: false,
      }),
    ]).start();
  }, [scaleAnim, glowAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 6,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [scaleAnim, glowAnim]);

  const handlePress = useCallback(() => {
    Vibration.vibrate(40);
    onPress?.();
  }, [onPress]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  const buttonSize  = isPrimary ? styles.primaryButton : styles.normalButton;
  const iconSize    = isPrimary ? styles.primaryIcon   : styles.normalIcon;
  const labelStyle  = isPrimary ? styles.primaryLabel  : styles.normalLabel;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        android_ripple={null}
        style={({ pressed }) => [
          styles.button,
          buttonSize,
          { borderColor: color },
          pressed && styles.buttonPressed,
        ]}
      >
        {/* Glow overlay */}
        <Animated.View
          style={[
            styles.glowOverlay,
            { backgroundColor: color, opacity: glowOpacity },
          ]}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={[iconSize, { color: isSending ? '#888' : '#FFF' }]}>
            {icon}
          </Text>
          <Text style={[labelStyle, { color: color }]}>{label}</Text>
        </View>

        {/* Sending indicator */}
        {isSending && <View style={[styles.sendingDot, { backgroundColor: color }]} />}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 8,
  },
  button: {
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  normalButton: {
    width: 88,
    height: 88,
  },
  primaryButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  content: {
    alignItems: 'center',
    gap: 4,
  },
  normalIcon: {
    fontSize: 26,
  },
  primaryIcon: {
    fontSize: 32,
  },
  normalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  primaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sendingDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default RemoteButton;
