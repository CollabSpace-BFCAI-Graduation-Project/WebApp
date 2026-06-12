import { create } from "zustand";
import type { CreateSpaceResponse, InviteCode } from "@/lib/types/api-types";

interface CreateSpaceFormState {
  isOpen: boolean;
  step: 1 | 2 | 3;
  createdSpace: CreateSpaceResponse | null;
  createdInvite: InviteCode | null;
  setIsOpen: (isOpen: boolean) => void;
  setCreatedSpace: (space: CreateSpaceResponse) => void;
  setCreatedInvite: (invite: InviteCode | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useCreateSpaceFormStore = create<CreateSpaceFormState>((set) => ({
  isOpen: false,
  step: 1,
  createdSpace: null,
  createdInvite: null,

  setIsOpen: (isOpen) => set({ isOpen }),
  setCreatedSpace: (createdSpace) => set({ createdSpace }),
  setCreatedInvite: (createdInvite) => set({ createdInvite }),
  nextStep: () =>
    set((state) => ({
      step: state.step === 1 ? 2 : state.step === 2 ? 3 : 3,
    })),
  prevStep: () =>
    set((state) => ({
      step: state.step === 3 ? 2 : state.step === 2 ? 1 : 1,
    })),

  reset: () => {
    set({
      isOpen: false,
      step: 1,
      createdSpace: null,
      createdInvite: null,
    });
  },
}));
