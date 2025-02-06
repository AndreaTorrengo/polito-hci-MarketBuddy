import React, { useContext } from 'react';
import { Dialog as TremorDialog } from '@tremor/react';
import globalContext from '../../Context';

interface DialogProps {
    open: boolean;
    onClose: (val: boolean) => void;
    role?: "dialog" | "alertdialog"
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
    // Add other props from TremorDialogProps as needed
}

export const Dialog = ({ children, className, ...props }: DialogProps) => {
    const { theme } = useContext(globalContext) || {};
    return <TremorDialog className={className + (theme === 'dark' ? ' dark' : '')} {...props} >{children}</TremorDialog>;
};

export default Dialog;