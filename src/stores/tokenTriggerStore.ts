import { create } from "zustand";

type TokenTriggerStore = {
    counter: number;
    setCounter: (counter: number) => void;
    userID: number;
    setUserID: (id: number) => void;
}

const useTokenTriggerStore = create<TokenTriggerStore>((set) => ({
  counter: 0,
  setCounter: (counter) => set({ counter }),
  userID: 0,
  setUserID: (userID) => set({ userID })
}));

export default useTokenTriggerStore;
