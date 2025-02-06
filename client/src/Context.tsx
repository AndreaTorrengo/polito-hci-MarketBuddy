import React, { createContext, ReactNode } from 'react';

export interface AppContextProps {
    askConfirmation: (onConfirm: () => void, text?: string | ReactNode, cancelButtonText?: string, confirmButtonText?: string, color?: string) => void;
    showToastMessage: (content: React.ReactNode | string, variant?: string) => void;
    setPopupText: React.Dispatch<React.SetStateAction<string | ReactNode>>;
    setConfirmationCallback: React.Dispatch<React.SetStateAction<() => void>>;
    theme: 'light' | 'dark';
}

const globalContext = createContext<AppContextProps>(null!);

export default globalContext;