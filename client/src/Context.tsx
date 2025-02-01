import React, { createContext } from 'react';

interface AppContextProps {
    askConfirmation?: (onConfirm: () => void, text?: string, cancelButtonText?: string, confirmButtonText?: string) => void;
    showToastMessage?: (content: React.ReactNode | string, variant?: string) => void;
}

const globalContext = createContext<AppContextProps | undefined>(undefined);

export default globalContext;