
<div align="center">
  <!-- <img src="bloom.png" width="128" alt="Bloom Logo" /> -->
  <h1>🌸 Bloom Messenger</h1>
  <p><b>An open-source, end‑to‑end encrypted mobile messenger.</b></p>

  <!-- Badges -->
  <a href="https://github.com/slipe-fun/Bloom-mobile/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License">
  </a>
  <img src="https://img.shields.io/badge/Platform-iOS_16%2B_%7C_Android_(WIP)-lightgrey" alt="Platforms">
  <img src="https://img.shields.io/badge/Status-In_Active_Development-orange" alt="Status">
  <img src="https://img.shields.io/badge/Framework-React_Native_%7C_Expo-02569B?logo=react" alt="React Native">
</div>

---

## 📖 Overview

**Bloom** is a privacy-first, end‑to‑end encrypted messenger designed for both iOS and Android. Built with React Native and Expo, it focuses on top-tier security without compromising ease of use. 

### ✨ Key Features
- **End‑to‑End Encryption (E2EE):** Total privacy for your conversations.
- **Post‑Quantum Cryptography:** Built for the future to resist advanced threats.
- **Cross-Platform:** Available on iOS *(Note: Android support is currently a Work in Progress).*
- **Intuitive UI/UX:** Designed to be as simple and user-friendly as possible.

---

## 🔐 Security & Encryption

Bloom doesn't rely on third-party E2EE frameworks. Instead, it utilizes **SKID** — a custom **post‑quantum** encryption protocol based on hybrid cryptography. 

- **Future-Proof:** Specifically designed for post‑quantum security.
- **Syncing:** Secure cross-device synchronization of private keys.
- **Hybrid Primitives:** Combines the best of modern cryptographic algorithms.
- **Built-in:** The SKID protocol source code is implemented and maintained directly within this repository.

---

## 🛠 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Language:** TypeScript / JavaScript
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Styling:** [React Native Unistyles](https://reactnativeunistyles.vercel.app/)

---

## 🚀 Getting Started

### Platform Requirements
- **iOS:** 16.0 or higher
- **Android:** API Level 30+ (Android 11+) *Work in progress (not fully supported yet)*

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/slipe-fun/Bloom-mobile.git
   cd Bloom-mobile
   ```

2. **Install dependencies:**
   *(Ensure you have `pnpm` installed)*
   ```bash
   pnpm install
   ```

### Running the App

1. **Prebuild the Expo project:**
   ```bash
   npx expo prebuild
   ```

2. **Start the development build:**
   ```bash
   # For iOS
   npx expo run:ios
   
   # For Android
   npx expo run:android
   ```

> **Note for Linux Users (Android Emulator):** 
> If you encounter a `CommandError` stating that the emulator could not be connected, ensure your `ANDROID_HOME` environment variable is set. Add the following to your `~/.bashrc` or `~/.zshrc` file and restart your terminal:
> ```bash
> export ANDROID_HOME=$HOME/Android/Sdk
> export PATH=$PATH:$ANDROID_HOME/emulator
> export PATH=$PATH:$ANDROID_HOME/platform-tools
> ```

---

## 📂 Project Structure

The project follows a standard Expo / React Native architecture. 
*Note: No `.env` files are used, and there is no runtime environment configuration required.*

- `app/` — Application routes and screens.
- `src/` — Core application logic and SKID protocol implementation.
- `layouts/` — Navigation stack and it's transitions.
- `assets/` — Static files, images, and fonts.
- `scripts/` — Utility scripts.

### Available Scripts
Generate an icon list:
```bash
pnpm run icons:generate
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the[issues page](https://github.com/slipe-fun/Bloom-mobile/issues) if you want to contribute.

## 📜 License
This project is licensed under the **Apache-2.0 License**. See the[LICENSE](LICENSE) file for more details.

---
<div align="center">
  <i>Built with ❤️ by the Bloom Team</i>
</div>
