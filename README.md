# 📺 Samsung Remote — React Native IR Blaster App

Aplikasi Android untuk mengontrol TV Samsung menggunakan IR Blaster bawaan smartphone, dibangun dengan React Native dan Android Native Module (Kotlin).

---

## 🏗️ Arsitektur Project

```
SamsungRemote/
├── android/
│   └── app/src/main/
│       ├── kotlin/com/samsungremote/
│       │   ├── IRBlasterModule.kt     ← Native Module inti (ConsumerIrManager)
│       │   ├── IRBlasterPackage.kt    ← Package registrar untuk React Native
│       │   ├── MainApplication.kt     ← Mendaftarkan IRBlasterPackage
│       │   └── MainActivity.kt
│       ├── res/values/
│       │   ├── strings.xml
│       │   └── styles.xml
│       └── AndroidManifest.xml        ← Permission TRANSMIT_IR
│
├── src/
│   ├── constants/
│   │   └── IRCodes.js                 ← Samsung NEC IR protocol encoder
│   ├── hooks/
│   │   └── useIRBlaster.js            ← React hook wrapper Native Module
│   ├── components/
│   │   ├── RemoteButton.js            ← Pressable button dengan animasi
│   │   ├── StatusBadge.js             ← Indikator status pengiriman IR
│   │   └── IRUnavailableModal.js      ← Modal jika IR tidak tersedia
│   └── screens/
│       └── RemoteScreen.js            ← Main screen UI
│
├── App.js
├── index.js
└── package.json
```

---

## ⚙️ Teknologi

| Layer | Teknologi |
|-------|-----------|
| Framework | React Native 0.79.x |
| Language JS | JavaScript (ES2022) |
| Language Native | Kotlin |
| Android API | `ConsumerIrManager` (`android.hardware.consumerir`) |
| Animasi | `Animated` API bawaan RN |
| Component Style | Functional Component + Hooks |

---

## 📡 Samsung IR Protocol

Aplikasi menggunakan protokol **Samsung NEC** dengan parameter:

| Parameter | Nilai |
|-----------|-------|
| Carrier Frequency | **38,000 Hz** |
| Lead burst ON | 4500 µs |
| Lead burst OFF | 4500 µs |
| Bit-1 space | 1690 µs |
| Bit-0 space | 565 µs |
| Bit pulse width | 560 µs |
| Device Address | `0x07` (Samsung TV) |

### Kode Command Samsung TV

| Fungsi | Command Byte |
|--------|-------------|
| Power ON/OFF | `0x02` |
| Volume Up | `0x07` |
| Volume Down | `0x0B` |
| Mute | `0x0F` |
| Channel Up | `0x12` |
| Channel Down | `0x10` |

> **Catatan:** Kode di atas berlaku untuk mayoritas TV Samsung. Beberapa model lawas atau QLED terbaru mungkin menggunakan kode berbeda. Edit `src/constants/IRCodes.js` jika perlu.

---

## 🚀 Setup & Instalasi

### Prerequisites

- Node.js ≥ 18
- JDK 17
- Android Studio (Hedgehog atau lebih baru)
- Android SDK API 35
- NDK 27.1.x
- Perangkat Android dengan IR Blaster (contoh: OPPO Find X9, Xiaomi 14, Huawei Mate 60)

### 1. Clone & Install Dependencies

```bash
git clone <repo-url> SamsungRemote
cd SamsungRemote
npm install
```

### 2. Build & Run ke Perangkat

```bash
# Pastikan perangkat terhubung via USB (Developer Mode ON)
npx react-native run-android
```

### 3. Release Build

```bash
cd android
./gradlew assembleRelease
# APK → android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔌 Cara Kerja Native Module

### 1. `IRBlasterModule.kt`

```kotlin
// Mendapatkan ConsumerIrManager dari sistem Android
val irManager = context.getSystemService(Context.CONSUMER_IR_SERVICE) as ConsumerIrManager

// Cek ketersediaan IR
irManager.hasIrEmitter()

// Kirim sinyal IR
irManager.transmit(38000, intArrayOf(4500, 4500, 560, 1690, ...))
```

### 2. `IRBlasterPackage.kt`
Mendaftarkan `IRBlasterModule` ke React Native module registry.

### 3. `useIRBlaster.js` (JS Hook)
```js
const { isSupported, sendCommand, lastStatus } = useIRBlaster();
await sendCommand(SAMSUNG_CODES.VOLUME_UP);
```

---

## 🛠️ Troubleshooting

### IR tidak berfungsi
1. Pastikan permission `TRANSMIT_IR` ada di `AndroidManifest.xml`
2. Cek apakah perangkat memiliki IR: **Settings → About Phone** atau gunakan aplikasi CIRManager
3. Beberapa OEM (OPPO, Xiaomi) memerlukan izin tambahan di pengaturan aplikasi

### `IRBlasterModule` null di JS
- Pastikan `IRBlasterPackage` sudah didaftarkan di `MainApplication.kt`
- Rebuild proyek: `cd android && ./gradlew clean && cd .. && npx react-native run-android`

### Kode IR tidak cocok
- TV Samsung memiliki variasi kode berdasarkan tahun model
- Gunakan aplikasi seperti **SmartIR** untuk capture kode dari remote fisik
- Update `SAMSUNG_CODES` di `src/constants/IRCodes.js`

---

## 📱 Perangkat yang Diuji

| Perangkat | Android | IR | Status |
|-----------|---------|-----|--------|
| OPPO Find X9 | 15 | ✅ | ✅ Supported |
| Xiaomi 14 | 14 | ✅ | ✅ Supported |
| Huawei Mate 60 Pro | HarmonyOS 4 | ✅ | ✅ Supported |
| Samsung Galaxy S24 | 14 | ❌ | ❌ No IR |

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.
