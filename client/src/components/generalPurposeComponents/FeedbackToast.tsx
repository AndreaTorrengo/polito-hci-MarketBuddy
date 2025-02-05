
import React, { ReactNode } from 'react';
import { AlertTriangle, OctagonAlert, Info, CircleCheck, X } from 'lucide-react';

interface FeedbackToastProps {
    show: boolean;
    children: ReactNode;
    variant?: string;
    className?: string;
    onClick?: () => void;
}


const FeedbackToast: React.FC<FeedbackToastProps> = ({ show, variant, children, className, ...props }) => {
    let color = '';
    let icon;
    switch (variant) {
        case 'danger':
        case 'error':
            color = 'bg-red-400 text-black';
            icon = <OctagonAlert />;
            break;
        case 'success':
            color = 'bg-green-300 text-black';
            icon = <CircleCheck />;
            break;
        case 'warning':
            color = 'bg-yellow-400 text-black';
            icon = <AlertTriangle />;
            break;
        case 'info':
        default:
            color = 'bg-blue-300 text-black';
            icon = <Info />;
    }

    return (
        // left-1/2 -translate-x-1/2
        <button hidden={!show}
            className={`fixed z-50 top-24 right-4 py-2 px-3 text-sm rounded-md flex max-w-72 gap-2 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} ${color} ${className}`}
            onClick={props.onClick}
            {...props}
        >
            <span className='opacity-100 flex items-center'>{icon}</span>
            <div className='flex items-center'>{children}</div>
            <span className='opacity-80 cursor-pointer flex items-center'><X size={18} /></span>
        </button>
    );

};

export default FeedbackToast;