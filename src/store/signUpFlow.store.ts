import { create } from 'zustand';

export type SignUpStep = 'email' | 'otp' | 'profile';

export interface SignUpFormData {
  email: string;
  otp: string;
  names: string;
  lastName: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
  phoneNumber: string;
  termsAccepted: boolean;
}

interface SignUpFlowState {
  step: SignUpStep;
  formData: SignUpFormData;
  setStep: (step: SignUpStep) => void;
  setField: <K extends keyof SignUpFormData>(key: K, value: SignUpFormData[K]) => void;
  setFormData: (payload: Partial<SignUpFormData>) => void;
  resetFlow: () => void;
}

const initialFormData: SignUpFormData = {
  email: '',
  otp: '',
  names: '',
  lastName: '',
  birthDate: '',
  password: '',
  confirmPassword: '',
  phoneCode: '+591',
  phoneNumber: '',
  termsAccepted: false,
};

const initialState = {
  step: 'email' as SignUpStep,
  formData: initialFormData,
};

export const useSignUpFlowStore = create<SignUpFlowState>()((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  setFormData: (payload) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...payload,
      },
    })),
  resetFlow: () => set(initialState),
}));
