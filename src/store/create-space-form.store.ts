import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SelectedVibe } from "@/features/spaces/types";

type Step = 1 | 2 | 3;

interface CreateSpaceUIState {
  isOpen: boolean;
  step: Step;
}

interface CreateSpaceFormData {
  spaceName: string;
  description: string;
  selectedVibe: SelectedVibe;
}

interface CreateSpaceFormState extends CreateSpaceUIState, CreateSpaceFormData {
  setIsOpen: (isOpen: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSpaceName: (spaceName: string) => void;
  setDescription: (description: string) => void;
  setSelectedVibe: (selectedVibe: SelectedVibe) => void;
  reset: () => void;
}

type PersistedCreateSpaceFormState = Pick<CreateSpaceFormData, "spaceName" | "description" | "selectedVibe">;

export const useCreateSpaceFormStore = create<
  CreateSpaceFormState,
  [["zustand/persist", PersistedCreateSpaceFormState]]
>(
  persist(
    (set) => ({
      // initial state
      isOpen: false,
      step: 1,
      spaceName: "",
      description: "",
      selectedVibe: null,

      // setters
      setIsOpen: (isOpen) => set({ isOpen }),
      nextStep: () =>
        set((state) => ({
          step:
            state.step === 1
              ? 2
              : state.step === 2
              ? 3
              : 3,
        })),
      prevStep: () =>
        set((state) => ({
          step:
            state.step === 3
              ? 2
              : state.step === 2
              ? 1
              : 1,
        })),
      setSpaceName: (spaceName) => set({ spaceName }),
      setDescription: (description) => set({ description }),
      setSelectedVibe: (selectedVibe) => set({ selectedVibe }),

      // reset all state (modal + form)
      reset: () =>
        set({
          isOpen: false,
          step: 1,
          spaceName: "",
          description: "",
          selectedVibe: null,
        }),
    }),
    {
      name: "create-space-form-store",
      partialize: (state) => ({
        spaceName: state.spaceName,
        description: state.description,
        selectedVibe: state.selectedVibe,
      }),
    }
  )
);
