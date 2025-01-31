import { Button } from "./generalPurposeComponents/Button";

export default function ConfirmPopup({ text, cancelButtonText, confirmButtonText, closePopup, onConfirmCallback }: Readonly<{ text: string, cancelButtonText: string, confirmButtonText: string, closePopup: () => void, onConfirmCallback: () => void }>) {
    return (
        <>
            <div className="fixed inset-0 bg-black opacity-35" />
            <button className="fixed inset-0 flex items-center justify-center" onClick={closePopup} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') closePopup(); }}>
                <div className="p-6 m-8 rounded-lg shadow-md bg-tremor-background-muted dark:bg-dark-tremor-background-muted">
                    <p className="mb-4 text-left">{text}</p>
                    <div className="flex justify-end space-x-4">
                        <Button color='primary' variant='outlined' onClick={() => closePopup()}>{cancelButtonText}</Button>
                        <Button color='primary' variant='contained' onClick={() => { closePopup(); onConfirmCallback(); }}>{confirmButtonText}</Button>
                    </div>
                </div>
            </button>
        </>
    );
}
