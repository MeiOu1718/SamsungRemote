/**
 * useIRBlaster — React hook wrapping the IRBlasterModule native module.
 *
 * Provides:
 *  - isSupported: boolean | null  (null = not yet checked)
 *  - sendCommand(pattern): Promise<void>
 *  - lastStatus: 'idle' | 'sending' | 'success' | 'error'
 *  - errorMessage: string | null
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { NativeModules, Platform } from 'react-native';
import { IR_FREQUENCY } from '../constants/IRCodes';

const { IRBlasterModule } = NativeModules;

export function useIRBlaster() {
  const [isSupported, setIsSupported]   = useState(null);
  const [lastStatus, setLastStatus]     = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);
  const statusTimerRef = useRef(null);

  // Check IR blaster availability on mount
  useEffect(() => {
    if (Platform.OS !== 'android') {
      setIsSupported(false);
      return;
    }

    if (!IRBlasterModule) {
      console.warn('[IRBlaster] IRBlasterModule not found. Did you link the native module?');
      setIsSupported(false);
      return;
    }

    IRBlasterModule.hasIRBlaster()
      .then(available => setIsSupported(available))
      .catch(err => {
        console.error('[IRBlaster] hasIRBlaster error:', err);
        setIsSupported(false);
      });

    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  /**
   * Send an IR command pattern
   * @param {number[]} pattern - Array of ON/OFF durations in microseconds
   */
  const sendCommand = useCallback(async (pattern) => {
    if (!IRBlasterModule) {
      setErrorMessage('IR Blaster module not available');
      setLastStatus('error');
      return;
    }

    if (isSupported === false) {
      setErrorMessage('This device does not have an IR blaster');
      setLastStatus('error');
      return;
    }

    // Clear any pending reset
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);

    setLastStatus('sending');
    setErrorMessage(null);

    try {
      await IRBlasterModule.transmit(IR_FREQUENCY, pattern);
      setLastStatus('success');
    } catch (err) {
      const msg = err?.message ?? 'Unknown IR error';
      console.error('[IRBlaster] transmit error:', msg);
      setErrorMessage(msg);
      setLastStatus('error');
    } finally {
      // Auto-reset status after 1.5 s
      statusTimerRef.current = setTimeout(() => setLastStatus('idle'), 1500);
    }
  }, [isSupported]);

  return { isSupported, sendCommand, lastStatus, errorMessage };
}
