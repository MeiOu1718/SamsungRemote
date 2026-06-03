/**
 * RemoteScreen — Main screen of the Samsung Remote app.
 *
 * Layout:
 *   ┌──────────────────────────┐
 *   │  Samsung Remote  [badge] │  ← header
 *   ├──────────────────────────┤
 *   │        [ POWER ]         │  ← primary action
 *   ├──────────────────────────┤
 *   │   [Vol+]      [Vol-]     │
 *   │   [Mute]                 │
 *   ├──────────────────────────┤
 *   │   [Ch+]       [Ch-]      │
 *   └──────────────────────────┘
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import RemoteButton from '../components/RemoteButton';
import StatusBadge from '../components/StatusBadge';
import IRUnavailableModal from '../components/IRUnavailableModal';
import { useIRBlaster } from '../hooks/useIRBlaster';
import { SAMSUNG_CODES } from '../constants/IRCodes';

const RemoteScreen = () => {
  const { isSupported, sendCommand, lastStatus, errorMessage } = useIRBlaster();
  const [showModal, setShowModal] = useState(false);

  const handlePress = useCallback((code) => {
    if (isSupported === false) {
      setShowModal(true);
      return;
    }
    sendCommand(code);
  }, [isSupported, sendCommand]);

  const isSending = lastStatus === 'sending';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SAMSUNG</Text>
          <Text style={styles.appTitle}>Smart Remote</Text>
        </View>
        <StatusBadge status={lastStatus} errorMessage={errorMessage} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TV Illustration */}
        <View style={styles.tvContainer}>
          <View style={styles.tvScreen}>
            <Text style={styles.tvIcon}>📺</Text>
          </View>
          <View style={styles.tvStand} />
        </View>

        {/* ───── POWER ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Power</Text>
          <View style={styles.centerRow}>
            <RemoteButton
              label="Power"
              icon="⏻"
              color="#FF4444"
              isPrimary
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.POWER)}
            />
          </View>
        </View>

        {/* ───── VOLUME ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Volume</Text>
          <View style={styles.row}>
            <RemoteButton
              label="Vol +"
              icon="🔊"
              color="#0A84FF"
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.VOLUME_UP)}
            />
            <RemoteButton
              label="Mute"
              icon="🔇"
              color="#FF9500"
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.MUTE)}
            />
            <RemoteButton
              label="Vol -"
              icon="🔉"
              color="#0A84FF"
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.VOLUME_DOWN)}
            />
          </View>
        </View>

        {/* ───── CHANNEL ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Channel</Text>
          <View style={styles.row}>
            <RemoteButton
              label="Ch +"
              icon="⬆"
              color="#30D158"
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.CHANNEL_UP)}
            />
            <RemoteButton
              label="Ch -"
              icon="⬇"
              color="#30D158"
              isSending={isSending}
              onPress={() => handlePress(SAMSUNG_CODES.CHANNEL_DOWN)}
            />
          </View>
        </View>

        {/* IR status note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>
            {isSupported === null ? '⏳' : isSupported ? '✅' : '❌'}
          </Text>
          <Text style={styles.infoText}>
            {isSupported === null
              ? 'Checking IR blaster…'
              : isSupported
              ? 'IR blaster ready'
              : 'IR blaster not available on this device'}
          </Text>
        </View>
      </ScrollView>

      <IRUnavailableModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  brand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0A84FF',
    letterSpacing: 3,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // TV illustration
  tvContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  tvScreen: {
    width: 140,
    height: 90,
    backgroundColor: 'rgba(10,132,255,0.08)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(10,132,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvIcon: {
    fontSize: 48,
  },
  tvStand: {
    width: 40,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  // Sections
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  centerRow: {
    alignItems: 'center',
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
});

export default RemoteScreen;
