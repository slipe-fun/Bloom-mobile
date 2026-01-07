# Bloom iOS / Android

Source code of **Bloom**, a mobile messenger built with **React Native** and **Expo**.

---

## Overview

Bloom is an end‑to‑end encrypted messenger for iOS and Android, built with React Native and Expo.

The project focuses on:

* End‑to‑end encrypted messaging
* Post‑quantum cryptography
* Ease of use

The repository includes:

* Mobile client source code
* Source code of the SKID encryption protocol

---

## Encryption

Bloom uses **SKID**, a custom **post‑quantum** encryption protocol based on **hybrid cryptography**.

Key points:

* Designed for post‑quantum security
* Cross-device synchronization of private keys
* Uses hybrid encryption primitives
* Implemented and maintained within this repository

The messenger relies directly on the SKID implementation; no external E2EE frameworks are used.

---

## Tech Stack

* React Native
* Expo
* pnpm
* TypeScript / JavaScript (see source)

---

## Platform Requirements

* **iOS:** 15+
* **Android:** API level 29+ (below is not recommended)

---

## Installation

```bash
pnpm install
```

---

## Run

```bash
npx expo prebuild
```

Then

```bash
npx expo run:ios
npx expo run:android
```

---

## Scripts

Generate icon list:

```bash
pnpm run icons:generate
```

---

## Environment

* No `.env` files are used
* No runtime environment configuration

---

## Project Structure

The project follows a standard Expo / React Native structure.

The SKID protocol source code is included in the repository.

---

## License

Apache-2.0 license

---

## Status

In active development.
