
import React, { ReactNode } from 'react';

interface FeedbackToastProps {
    show: boolean;
    children: ReactNode;
    variant?: string;
    className?: string;
    onClick?: () => void;
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
        // left-1/2 -translate-x-1/2
        <button
            className={`fixed top-24 right-4 animated py-2 px-3 rounded-md flex max-w-72 gap-2 ${show ? 'opacity-100 z-50' : 'opacity-0 -z-50'} ${color} ${className}`}
            onClick={props.onClick}
            {...props}
        >
            {children}
            <span className='opacity-80 cursor-pointer'>⨯</span>
        </button>
    );

};

export default FeedbackToast;