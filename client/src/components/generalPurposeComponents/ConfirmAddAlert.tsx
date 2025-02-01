import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';
import { ProductListItemProps } from '../PageVendorProducts/ProductListItem';

interface ConfirmAddAlertProps {
    theme: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleAdd: () => void;
    products: Map<number, ProductListItemProps>;
    isFeedbackDialogOpen: string | null;
    setIsFeedbackDialogOpen: (value: string | null) => void;
}

const ConfirmAddAlert: React.FC<ConfirmAddAlertProps> = ({
    theme,
    isOpen,
    setIsOpen,
    handleAdd,
    products,
    isFeedbackDialogOpen,
    setIsFeedbackDialogOpen
}) => {



    return (
        <>
            <Dialog className={theme === 'dark' ? 'dark z-[10000001]' : 'z-[10000001]'} open={isOpen} onClose={() => { setIsOpen(false) }}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Add</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>The following products will be added to your shopping list:</p>
                    <div>
                        <div className="products-text">
                            <span style={{ fontWeight: 'bold' }}>{Array.from(products.values()).map(product => product.name).join(', ')}</span>

                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'right', gap: '10px', marginTop: '20px' }}>
                        <Button className="button-cancel" style={{ backgroundColor: 'transparent', borderColor: theme === 'dark' ? 'white' : 'black', color: theme === 'dark' ? 'white' : 'black', borderWidth: '1px' }} onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button className="button" onClick={() => { setIsFeedbackDialogOpen('add'), setIsOpen(false), handleAdd() }}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog >
        </>
    );
};

export default ConfirmAddAlert;