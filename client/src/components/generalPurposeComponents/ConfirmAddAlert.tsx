import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';
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

    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    return (
        <>
            <Dialog className={theme === 'dark' ? 'dark z-[10000000]' : 'z-[10000000]'} open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Add</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>The following products will be added to your shopping list:</p>
                    <div>
                        <div className="products-text">
                            <span style={{ fontWeight: 'bold' }}>{Array.from(products.values()).map(product => product.name).join (', ')}</span>

                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'right', gap: '10px', marginTop: '20px' }}>
                        <Button className="button-cancel" style={{ backgroundColor: 'transparent', borderColor: theme === 'dark' ? 'white' : 'black', color: theme === 'dark' ? 'white' : 'black', borderWidth: '1px' }} onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button className="button" onClick={() => {setIsFeedbackDialogOpen(true),setIsOpen(false)}}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog>
            <Dialog className={theme === 'dark' ? 'dark z-[10000000]' : 'z-[10000000]'} open={isFeedbackDialogOpen} onClose={() => { setIsFeedbackDialogOpen(false);handleAdd()}}>
                <DialogPanel>

                    <>
                        <button
                            style={{ position: 'absolute', top: '0px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            onClick={() => { setIsFeedbackDialogOpen(false);handleAdd()}}
                        >
                            &times;
                        </button>
                        <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                        <p className="message-text" style={{ marginTop: '10px' }}>Selected products have been succesfully deleted from your shopping list</p>
                    </>


                </DialogPanel>
            </Dialog>
        </>
    );
};

export default ConfirmAddAlert;