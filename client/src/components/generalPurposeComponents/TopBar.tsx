import React from 'react';

interface TopBarProps {
    leftComponent?: React.ReactNode;
    centerComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

export default function TopBar({ leftComponent, centerComponent, rightComponent }: Readonly<TopBarProps>) {
    return (
        <div className="w-full h-14 bg-transparent flex flex-row items-center justify-between">
            <div className="">{leftComponent}</div>
            <div className="">{centerComponent}</div>
            <div className="flex flex-row justify-items-end">{rightComponent}</div>
        </div>
    );
}