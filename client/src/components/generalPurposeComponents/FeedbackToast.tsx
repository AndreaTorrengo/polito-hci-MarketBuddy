
import React, { ReactNode } from 'react';

interface FeedbackToastProps {
    show: boolean;
    variant: 'danger' | 'error' | 'success' | 'warning' | 'info';
    children: ReactNode;
    className?: string;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({ show, variant, children, className, ...props }) => {
    let color = '';
    switch (variant) {
        case 'danger':
        case 'error':
            color = 'bg-red-400 text-black';
            break;
        case 'success':
            color = 'bg-green-400 text-black';
            break;
        case 'warning':
            color = 'bg-yellow-400 text-black';
            break;
        case 'info':
        default:
            color = 'bg-blue-300 text-black';
    }

    return (
        <div
            className={`fixed bottom-20 left-1/2 animated -translate-x-1/2 py-1.5 px-2.5 rounded-md z-0 ${show ? 'opacity-100' : 'opacity-0 -z-50'} ${color} ${className}`}
            {...props}
        >
            {children}
        </div>
    );

};

export default FeedbackToast;