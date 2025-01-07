
export default function ConfirmPopup({ text, cancelButtonText, confirmButtonText, closePopup, onConfirmCallback }: Readonly<{ text: string, cancelButtonText: string, confirmButtonText: string, closePopup: Function, onConfirmCallback: Function }>) {
    return (
        <div className="fixed inset-0 flex items-center justify-center m-8">
            <div className="p-6 rounded shadow-md bg-tremor-background-muted dark:bg-dark-tremor-background-muted">
                <p className="mb-4">{text}</p>
                <div className="flex justify-end space-x-4">
                    <button className="bg-red-500 px-4 py-2 text-tremor-content-inverted rounded animated active:brightness-75" onClick={() => closePopup()}>
                        {cancelButtonText}
                    </button>
                    <button className="bg-blue-500 px-4 py-2 text-tremor-content-inverted rounded animated active:brightness-75" onClick={() => closePopup() || onConfirmCallback()}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
