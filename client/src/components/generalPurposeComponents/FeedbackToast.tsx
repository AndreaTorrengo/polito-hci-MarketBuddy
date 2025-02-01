
import React, { ReactNode } from 'react';

interface FeedbackToastProps {
    show: boolean;
    children: ReactNode;
    variant?: string;
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
            color = 'bg-green-300 text-black';
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
            className={`fixed bottom-28 left-1/2 -translate-x-1/2 animated py-2 px-3 rounded-md z-0 w-3/4 ${show ? 'opacity-100' : 'opacity-0 -z-50'} ${color} ${className}`}
            {...props}
        >
            {children}
        </div>
    );

};

export default FeedbackToast;