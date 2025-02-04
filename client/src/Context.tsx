import React, { createContext, ReactNode } from 'react';

interface AppContextProps {
    askConfirmation?: (onConfirm: () => void, text?: string | ReactNode, cancelButtonText?: string, confirmButtonText?: string) => void;
    showToastMessage?: (content: React.ReactNode | string, variant?: string) => void;
    setPopupText?: React.Dispatch<React.SetStateAction<string | ReactNode>>;
}

const globalContext = createContext<AppContextProps | undefined>(undefined);

export default globalContext;