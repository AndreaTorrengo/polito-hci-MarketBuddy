import React from 'react';

interface TopBarProps {
    leftComponent?: React.ReactNode;
    centerComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

export default function TopBar({ leftComponent, centerComponent, rightComponent }: Readonly<TopBarProps>) {
    return (
        <div className="w-full h-14 bg-transparent flex flex-row items-center justify-center">
            <div className="max-w-1/3 me-auto">{leftComponent}</div>
            <div className="max-w-1/3 place-self-center">{centerComponent}</div>
            <div className="flex flex-row ms-auto justify-items-end">{rightComponent}</div>
        </div>
    );
}