/**
 * StatusBadge — small pill that shows the current IR transmit status.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const STATUS_MAP = {
  idle:    { label: 'Ready',    color: '#30D158', bg: 'rgba(48,209,88,0.12)'  },
  sending: { label: 'Sending…', color: '#FF9500', bg: 'rgba(255,149,0,0.12)'  },
  success: { label: '✓ Sent',   color: '#30D158', bg: 'rgba(48,209,88,0.18)'  },
  error:   { label: '✗ Error',  color: '#FF4444', bg: 'rgba(255,68,68,0.12)'  },
};

const StatusBadge = ({ status = 'idle', errorMessage }) => {
  const config   = STATUS_MAP[status] ?? STATUS_MAP.idle;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse on status change
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.4, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1,   duration: 200, useNativeDriver: true }),
    ]).start();
  }, [status, fadeAnim]);

  return (
    <Animated.View style={[styles.badge, { backgroundColor: config.bg, opacity: fadeAnim }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>
        {status === 'error' && errorMessage ? errorMessage : config.label}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    maxWidth: 220,
  },
});

export default StatusBadge;
