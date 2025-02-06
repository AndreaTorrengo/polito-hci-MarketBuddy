import React from 'react';
import { DialogPanel } from '@tremor/react';
import { Dialog } from '../generalPurposeComponents/Dialog.tsx';
import './Dialogs.css';


interface FeedbackAddDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackAddDialog: React.FC<FeedbackAddDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogPanel>
                        <button
                            style={{ position: 'absolute', top: '0px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            onClick={onClose}
                        >
                            &times;
                        </button>
                        <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                <p className="message-text" style={{ marginTop: '10px' }}>Selected products have been succesfully added to your shopping list</p>
                </DialogPanel>
        </Dialog>
    );
};

export default FeedbackAddDialog;