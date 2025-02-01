import { Dialog, DialogPanel } from '@tremor/react';
import React, { useContext } from 'react';
import globalContext from '../../Context';

interface ConfirmDeleteAlertProps {
    theme: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleDelete: () => Promise<void>;
    numberOfProducts: number;
}

const ConfirmDeleteAlert: React.FC<ConfirmDeleteAlertProps> = ({
    theme,
    isOpen,
    setIsOpen,
    handleDelete,
    numberOfProducts,
}) => {

    const showToastMessage = useContext(globalContext)?.showToastMessage;
    return (
        <Dialog open={isOpen} static={true} onClose={() => { setIsOpen(false) }} className={`max-h-screen overflow-y-auto ${theme === 'dark' ? 'dark' : ''} z-[5000]`}>
            <DialogPanel className="dialog-panel max-h-screen overflow-y-auto">
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-black dark:text-white">Delete Products</h1>
                    <p className="dark:text-[#aaaaaa] text-[#444444]">{"Are you sure you want to delete " + numberOfProducts + " product/s?"}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            onClick={async () => {
                                await handleDelete();
                                setIsOpen(false);
                                showToastMessage && showToastMessage('Products removed successfully!', 'success');
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
    );
};

export default ConfirmDeleteAlert;