import { create } from "zustand";
interface CreateSpaceFormState {
  isOpen: boolean;
  step: 1 | 2 | 3;
  setIsOpen: (isOpen: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useCreateSpaceFormStore = create<CreateSpaceFormState>((set) => ({
  isOpen: false,
  step: 1,

  setIsOpen: (isOpen) => set({ isOpen }),
  nextStep: () =>
    set((state) => ({
      step: state.step === 1 ? 2 : state.step === 2 ? 3 : 3,
    })),
  prevStep: () =>
    set((state) => ({
      step: state.step === 3 ? 2 : state.step === 2 ? 1 : 1,
    })),

  reset: () => {
    set({ isOpen: false });
    setTimeout(() => {
      set({
        step: 1,
      });
    }, 500);
  },
}));
