import { create } from "zustand";

const useSettingsScreenStore = create((set) => ({
  headerHeight: 0,
  setHeaderHeight: (newHeaderHeight) => set({ headerHeight: newHeaderHeight }),
  snapEndPosition: 0,
  setSnapEndPosition: (newSnapEndPosition) => set({ snapEndPosition: newSnapEndPosition }),
}));

export default useSettingsScreenStore;
