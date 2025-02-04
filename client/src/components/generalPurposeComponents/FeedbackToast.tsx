
import React, { ReactNode } from 'react';

interface FeedbackToastProps {
    show: boolean;
    children: ReactNode;
    variant?: string;
    className?: string;
    onClick?: () => void;
}
const alert = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
const error = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16h.01" /><path d="M12 8v4" /><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" /></svg>
const info = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
const success = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>


const FeedbackToast: React.FC<FeedbackToastProps> = ({ show, variant, children, className, ...props }) => {
    let color = '';
    let icon;
    switch (variant) {
        case 'danger':
        case 'error':
            color = 'bg-red-400 text-black';
            icon = error;
            break;
        case 'success':
            color = 'bg-green-300 text-black';
            icon = success;
            break;
        case 'warning':
            color = 'bg-yellow-400 text-black';
            icon = alert;
            break;
        case 'info':
        default:
            color = 'bg-blue-300 text-black';
            icon = info;
    }

    return (
        // left-1/2 -translate-x-1/2
        <button
            className={`fixed top-24 right-4 animated py-2 px-3 text-sm rounded-md flex max-w-72 gap-2 ${show ? 'opacity-100 z-50' : 'opacity-0 -z-50'} ${color} ${className}`}
            onClick={props.onClick}
            {...props}
        >
            <span className='opacity-100 flex items-center'>{icon}</span>
            <div className='flex items-center'>{children}</div>
            <span className='opacity-80 cursor-pointer flex items-center'>⨯</span>
        </button>
    );

};

export default FeedbackToast;