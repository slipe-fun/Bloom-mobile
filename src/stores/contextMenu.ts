import { create } from "zustand";

type ContextMenuStore = {
    focused: boolean
    setFocused: (newFocused: boolean) => void
}

const useContextMenuStore = create<ContextMenuStore>((set) => ({
  focused: false,
  setFocused: (newFocused) => set({ focused: newFocused }),
}));

export default useContextMenuStore;
