import { DialogPanel } from '@tremor/react';
import { Dialog } from '../generalPurposeComponents/Dialog'
import React, { useContext } from 'react';
import globalContext from '../../Context';
import { ProductListItemProps } from '../PageVendorProducts/ProductListItem';

interface ConfirmAddAlertProps {
    theme: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleAdd: () => void;
    products: Map<number, ProductListItemProps>;
}

const ConfirmAddAlert: React.FC<ConfirmAddAlertProps> = ({
    theme,
    isOpen,
    setIsOpen,
    handleAdd,
    products,
}) => {
    const showToastMessage = useContext(globalContext)?.showToastMessage;

    return (
        <Dialog className={theme === 'dark' ? 'dark' : ''} open={isOpen} onClose={() => { setIsOpen(false) }}>
            <DialogPanel>
                <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Add</h1>
                <p className="message-text" style={{ marginTop: '10px' }}>The following products will be added to your shopping list:</p>
                <div>
                    <div className="products-text">
                        <span style={{ fontWeight: 'bold' }}>{Array.from(products.values()).map(product => product.name).join(', ')}</span>

                    </div>
                </div>

                <div className="flex justify-right gap-2.5 mt-5">
                    <button
                        className="bg-tremor-brand text-white px-4 py-2 rounded-lg"
                        onClick={async () => {
                            handleAdd();
                            setIsOpen(false);
                            showToastMessage && showToastMessage('Products added successfully!', 'success');
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
            </DialogPanel>
        </Dialog >
    );
};

export default ConfirmAddAlert;