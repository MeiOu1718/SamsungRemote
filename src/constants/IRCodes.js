/**
 * Samsung TV IR Codes
 *
 * Protocol: Samsung (NEC variant)
 * Carrier Frequency: 38000 Hz
 *
 * Pattern format: [leadOn, leadOff, bit pairs..., trailing]
 *   - Each bit is: short pulse + short space (0) or short pulse + long space (1)
 *   - All values are in microseconds
 *
 * Samsung NEC timing:
 *   Lead burst:   4500 µs ON, 4500 µs OFF
 *   Bit 1:         560 µs ON, 1690 µs OFF
 *   Bit 0:         560 µs ON,  565 µs OFF
 *   Trailing:      560 µs ON
 */

export const IR_FREQUENCY = 38000; // Hz

// ---------------------------------------------------------------------------
// Helper — encode a Samsung NEC frame
// address: 8-bit device address (Samsung TV = 0x07)
// command: 8-bit command byte
// ---------------------------------------------------------------------------
function samsungFrame(address, command) {
  const LEAD_ON  = 4500;
  const LEAD_OFF = 4500;
  const BIT_ON   = 560;
  const ONE_OFF  = 1690;
  const ZERO_OFF = 565;
  const TRAIL    = 560;

  const pattern = [LEAD_ON, LEAD_OFF];

  // Encode 8-bit address + ~address + command + ~command
  const bytes = [
    address,
    (~address) & 0xFF,
    command,
    (~command) & 0xFF,
  ];

  bytes.forEach(byte => {
    for (let bit = 0; bit < 8; bit++) {
      pattern.push(BIT_ON);
      pattern.push((byte >> bit) & 1 ? ONE_OFF : ZERO_OFF);
    }
  });

  pattern.push(TRAIL);
  return pattern;
}

// Samsung TV device address
const SAMSUNG_ADDRESS = 0x07;

export const SAMSUNG_CODES = {
  POWER:       samsungFrame(SAMSUNG_ADDRESS, 0x02),
  VOLUME_UP:   samsungFrame(SAMSUNG_ADDRESS, 0x07),
  VOLUME_DOWN: samsungFrame(SAMSUNG_ADDRESS, 0x0B),
  MUTE:        samsungFrame(SAMSUNG_ADDRESS, 0x0F),
  CHANNEL_UP:  samsungFrame(SAMSUNG_ADDRESS, 0x12),
  CHANNEL_DOWN:samsungFrame(SAMSUNG_ADDRESS, 0x10),
  // Extra codes for future expansion
  SOURCE:      samsungFrame(SAMSUNG_ADDRESS, 0x01),
  MENU:        samsungFrame(SAMSUNG_ADDRESS, 0x1A),
  HOME:        samsungFrame(SAMSUNG_ADDRESS, 0x79),
  BACK:        samsungFrame(SAMSUNG_ADDRESS, 0x58),
  UP:          samsungFrame(SAMSUNG_ADDRESS, 0x60),
  DOWN:        samsungFrame(SAMSUNG_ADDRESS, 0x61),
  LEFT:        samsungFrame(SAMSUNG_ADDRESS, 0x65),
  RIGHT:       samsungFrame(SAMSUNG_ADDRESS, 0x62),
  ENTER:       samsungFrame(SAMSUNG_ADDRESS, 0x68),
};

export const BUTTON_CONFIG = [
  {
    id: 'POWER',
    label: 'Power',
    icon: '⏻',
    code: SAMSUNG_CODES.POWER,
    isPrimary: true,
    color: '#FF4444',
  },
  {
    id: 'MUTE',
    label: 'Mute',
    icon: '🔇',
    code: SAMSUNG_CODES.MUTE,
    isPrimary: false,
    color: '#FF9500',
  },
  {
    id: 'VOLUME_UP',
    label: 'Vol +',
    icon: '🔊',
    code: SAMSUNG_CODES.VOLUME_UP,
    isPrimary: false,
    color: '#0A84FF',
  },
  {
    id: 'VOLUME_DOWN',
    label: 'Vol -',
    icon: '🔉',
    code: SAMSUNG_CODES.VOLUME_DOWN,
    isPrimary: false,
    color: '#0A84FF',
  },
  {
    id: 'CHANNEL_UP',
    label: 'Ch +',
    icon: '⬆',
    code: SAMSUNG_CODES.CHANNEL_UP,
    isPrimary: false,
    color: '#30D158',
  },
  {
    id: 'CHANNEL_DOWN',
    label: 'Ch -',
    icon: '⬇',
    code: SAMSUNG_CODES.CHANNEL_DOWN,
    isPrimary: false,
    color: '#30D158',
  },
];
