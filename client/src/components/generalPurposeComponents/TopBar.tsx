import React from 'react';

interface TopBarProps {
    leftComponent?: React.ReactNode;
    centerComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

export default function TopBar({leftComponent, centerComponent, rightComponent}: TopBarProps) {
    return (
        <div className="z-[2000] w-full h-[3.4em] bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle fixed box-border">
            <div className="h-full w-full flex flex-row items-center px-5 gap-2">
                <div className="">{leftComponent}</div>
                <div className="">{centerComponent}</div>
                <div className="flex-1 flex flex-row justify-items-end gap-2">{rightComponent}</div>
            </div>
        </div>
    );
}