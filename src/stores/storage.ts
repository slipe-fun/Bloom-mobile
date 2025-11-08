import { create } from "zustand";

import type { MMKVInterface } from "react-native-mmkv/lib/typescript/src/Types";
import type { Realm } from "realm";

type StorageState = {
  mmkv: MMKVInterface | null;
  realm: Realm | null;
  setMMKV: (newMMKV: MMKVInterface) => void;
  setRealm: (newRealm: Realm) => void;
};

const useStorageStore = create<StorageState>((set) => ({
  mmkv: null,
  realm: null,
  setMMKV: (newMMKV) => set({ mmkv: newMMKV }),
  setRealm: (newRealm) => set({ realm: newRealm }),
}));

export default useStorageStore;
