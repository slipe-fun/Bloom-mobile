import { create } from "zustand";

type TokenTriggerStore = {
    counter: number;
    setCounter: (counter: number) => void
}

const useTokenTriggerStore = create<TokenTriggerStore>((set) => ({
  counter: 0,
  setCounter: (counter) => set({ counter }),
}));

export default useTokenTriggerStore;
