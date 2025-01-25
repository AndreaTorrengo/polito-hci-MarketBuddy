
export default function ConfirmPopup({ text, cancelButtonText, confirmButtonText, closePopup, onConfirmCallback }: Readonly<{ text: string, cancelButtonText: string, confirmButtonText: string, closePopup: () => void, onConfirmCallback: () => void }>) {
    return (
        <>
            <div className="fixed inset-0 bg-black opacity-35" />
            <button className="fixed inset-0 flex items-center justify-center" onClick={closePopup} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') closePopup(); }}>
                <div className="p-6 m-8 rounded-lg shadow-md bg-tremor-background-muted dark:bg-dark-tremor-background-muted">
                    <p className="mb-4">{text}</p>
                    <div className="flex justify-end space-x-4">
                        <button className="bg-red-500 px-4 py-2 text-tremor-content-inverted rounded animated active:brightness-75" onClick={() => closePopup()}>
                            {cancelButtonText}
                        </button>
                        <button className="bg-blue-500 px-4 py-2 text-tremor-content-inverted rounded animated active:brightness-75" onClick={() => { closePopup(); onConfirmCallback(); }}>
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </button>
        </>
    );
}
