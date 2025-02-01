import { Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';

interface ConfirmAddAlertProps {
    theme: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleAdd: () => Promise<void>;
    numberOfProducts: number;
}

const ConfirmAddAlert: React.FC<ConfirmAddAlertProps> = ({
    theme,
    isOpen,
    setIsOpen,
    handleAdd,
    numberOfProducts,
}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <>
            <Dialog open={isOpen} static={true} onClose={() => {setIsOpen(false)}} className={`max-h-screen overflow-y-auto ${theme === 'dark' ? 'dark' : ''} z-[5000]`}>
                <DialogPanel className="dialog-panel max-h-screen overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-black dark:text-white">Add Product/s</h1>
                        <p className="dark:text-[#aaaaaa] text-[#444444]">{"Are you sure you want to add "+ numberOfProducts + " product/s to your Shopping List?"}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-tremor-brand text-white px-4 py-2 rounded-lg"
                                onClick={async () => {
                                    await handleAdd();
                                    setShowConfirmation(true);
                                    setIsOpen(false);
                                    setTimeout(
                                        () => {
                                            setShowConfirmation(false);
                                        },
                                        3000
                                    )
                                }}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>


                </DialogPanel>
            </Dialog>
            {showConfirmation && (
                <div className="fixed inset-x-0 bottom-0 flex items-center justify-center z-[50000000] mb-40">
                    <div className="bg-green-500 p-4 text-white rounded-lg shadow-lg">
                        Products added successfully!
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmAddAlert;