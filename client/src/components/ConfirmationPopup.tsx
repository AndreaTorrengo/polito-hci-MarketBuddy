import React from "react";
import { Button } from "./generalPurposeComponents/Button.tsx";
export default function ConfirmPopup({ text, cancelButtonText, confirmButtonText, closePopup, onConfirmCallback, color }: Readonly<{ text: string | React.ReactNode, cancelButtonText: string, confirmButtonText: string, closePopup: () => void, onConfirmCallback: () => void , color: string }>) {
    return (
        <>
            <button className="fixed inset-0 bg-black opacity-35 z-40" onClick={closePopup} />
            <div className="p-6 m-8 rounded-lg shadow-md bg-tremor-background-muted dark:bg-dark-tremor-background-muted justify-between flex flex-col fixed inset-0 top-1/2 -translate-y-1/2 h-fit z-40 border border-tremor-border dark:border-dark-tremor-border">
                {typeof text === 'string' ? <span className="flex flex-row mb-4 text-left text-xl whitespace-pre-line">{text}</span> : text}
                <div className="flex flex-row justify-end space-x-4 mt-6">
                    <Button color='bw' variant='outlined' onClick={() => closePopup()}>{cancelButtonText}</Button>
                    <Button color={color} variant='contained' onClick={() => { closePopup(); onConfirmCallback(); }}>{confirmButtonText}</Button>
                </div>
            </div>
        </>
    );
}
