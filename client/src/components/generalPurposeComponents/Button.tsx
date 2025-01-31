import React from "react";

interface LargeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'contained' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
}

export const Button = ({ variant, size, children, className, ...props }: LargeButtonProps) => {
    let bg_color;
    let dark_bg_color;
    let fg_color;
    let dark_fg_color;
    let active_bg_color;
    let active_dark_bg_color;

    switch (props.color) {
        case undefined:
        case 'primary':
            bg_color = 'blue-500';
            fg_color = 'white';
            active_bg_color = 'blue-600';
            dark_bg_color = 'blue-700';
            dark_fg_color = 'white';
            active_dark_bg_color = 'blue-800';
            break;
        case 'secondary':
            bg_color = 'blue-400';
            fg_color = 'white';
            active_bg_color = 'blue-500';
            dark_bg_color = 'blue-600';
            dark_fg_color = 'white';
            active_dark_bg_color = 'blue-700';
            break;
        case 'error':
        case 'danger':
            bg_color = 'red-500';
            fg_color = 'white';
            active_bg_color = 'red-600';
            dark_bg_color = 'red-700 ';
            dark_fg_color = 'white';
            active_dark_bg_color = 'red-800';
            break;
        case 'success':
            bg_color = 'green-500';
            fg_color = 'white';
            active_bg_color = 'green-600';
            dark_bg_color = 'green-700';
            dark_fg_color = 'white';
            active_dark_bg_color = 'green-800';
            break;
        case 'warning':
            bg_color = 'yellow-500';
            fg_color = 'black';
            active_bg_color = 'yellow-600';
            dark_bg_color = 'yellow-700';
            dark_fg_color = 'white';
            active_dark_bg_color = 'yellow-800';
            break;
        case 'bw':
            bg_color = 'black';
            fg_color = 'white';
            active_bg_color = 'slate-800';
            dark_bg_color = 'white';
            dark_fg_color = 'black';
            active_dark_bg_color = 'slate-200';
            break;
        default:
            bg_color = props.color;
            fg_color = 'black';
            active_bg_color = props.color;
            dark_bg_color = props.color;
            dark_fg_color = 'white';
            active_dark_bg_color = props.color;
    }
    delete props.color;

    switch (variant) {
        case 'outlined':
            className = `${className} shadow-md bg-transparent border-2 border-${bg_color} text-${bg_color} active:border-${active_bg_color} active:text-${active_bg_color} dark:border-${dark_bg_color} dark:text-${dark_bg_color} active:dark:border-${active_dark_bg_color} active:dark:${active_dark_bg_color}`;
            break;
        case 'contained':
            className = `${className} shadow-md border-2 border-${bg_color} bg-${bg_color} text-${fg_color} active:bg-${active_bg_color} dark:bg-${dark_bg_color} dark:text-${dark_fg_color} active:dark:bg-${active_dark_bg_color} active:dark:text-${active_dark_bg_color}`;
            break;
        case 'text':
        default:
            className = `${className} bg-transparent text-${bg_color} dark:text-${dark_bg_color} active:${active_bg_color} active:dark:text-${active_dark_bg_color}`;
    }

    switch (size) {
        case 'small':
            className += ' text-xs';
            break;
        case 'large':
            className += ' text-lg font-bold uppercase tracking-wider';
            break;
        case 'medium':
        default:
            className += '';
    }

    return (
        <button
            className={`px-4 py-1 font-medium tracking-wide rounded animated flex align-middle ${props.disabled ? 'opacity-60' : 'active:brightness-90'} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}