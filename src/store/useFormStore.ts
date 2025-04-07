import { create } from 'zustand';
import { ChangeEvent } from 'react';

interface FormState {
    formInputs: { [key: string]: any };
    handleInputChange: (field: string) => (event: ChangeEvent<HTMLInputElement>) => void;
    resetForm: () => void;
}

const useFormStore = create<FormState>((set) => ({
    formInputs: {},

    handleInputChange: (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        set((state) => ({
            formInputs: {
                ...state.formInputs,
                [field]: value,
            },
        }));
    },

    resetForm: () => {
        set({ formInputs: {} });
    },
}));

export default useFormStore;
