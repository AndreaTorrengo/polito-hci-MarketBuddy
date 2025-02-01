import { Button } from "./generalPurposeComponents/Button";

export default function ConfirmPopup({ text, cancelButtonText, confirmButtonText, closePopup, onConfirmCallback }: Readonly<{ text: string, cancelButtonText: string, confirmButtonText: string, closePopup: () => void, onConfirmCallback: () => void }>) {
    return (
        <>
            <button className="fixed inset-0 bg-black opacity-35" onClick={closePopup} />
            <div className="p-6 m-8 rounded-lg shadow-md bg-tremor-background-muted dark:bg-dark-tremor-background-muted justify-between flex flex-col fixed inset-0 top-1/2 -translate-y-1/2 min-h-fit h-1/4  ">
                <p className="flex flex-row mb-4 text-left text-xl">{text}</p>
                <div className="flex flex-row justify-end space-x-4">
                    <Button color='primary' variant='outlined' onClick={() => closePopup()}>{cancelButtonText}</Button>
                    <Button color='primary' variant='contained' onClick={() => { closePopup(); onConfirmCallback(); }}>{confirmButtonText}</Button>
                </div>
            </div>
        </>
    );
}
