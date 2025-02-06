import React from 'react';
import { DialogPanel } from '@tremor/react';
import { Dialog } from '../generalPurposeComponents/Dialog';
import { Product } from '../../models';
import './Dialogs.css';

interface FeedbackSwitchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productsWithoutAlternatives: Product[];
}

const FeedbackSwitchDialog: React.FC<FeedbackSwitchDialogProps> = ({ isOpen, onClose, productsWithoutAlternatives }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
                <DialogPanel>
                    <button
                        style={{ position: 'absolute', top: '0px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    {productsWithoutAlternatives.length === 0 ? (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>All products have been successfully assigned to other sellers.</p>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'red' }}>Failed to Assign</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>The following products could not be assigned to other sellers:</p>
                            <div>
                                {productsWithoutAlternatives.map((product, index) => (
                                    <span className="products-text" key={index} style={{ fontWeight: 'bold' }}>
                                        {product.name}{index < productsWithoutAlternatives.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </DialogPanel>
        </Dialog>
    );
};

export default FeedbackSwitchDialog;