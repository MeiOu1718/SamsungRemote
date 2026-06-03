/**
 * IRUnavailableModal — shown when the device has no IR blaster.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';

const IRUnavailableModal = ({ visible, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>📡</Text>
          <Text style={styles.title}>No IR Blaster Detected</Text>
          <Text style={styles.body}>
            Your device does not have an infrared (IR) blaster, or the{' '}
            <Text style={styles.code}>ConsumerIrManager</Text> is unavailable.
          </Text>
          <Text style={styles.hint}>
            Devices with IR blasters: OPPO Find X9, Xiaomi series, Huawei Mate series, some Samsung Galaxy flagships (older models).
          </Text>

          <Pressable
            style={styles.button}
            onPress={onDismiss}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    maxWidth: 360,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  code: {
    fontFamily: 'monospace',
    color: '#0A84FF',
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: 'rgba(10,132,255,0.15)',
    borderWidth: 1,
    borderColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#0A84FF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default IRUnavailableModal;
