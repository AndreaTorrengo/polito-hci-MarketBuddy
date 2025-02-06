import React from 'react';
import { DialogPanel } from '@tremor/react';
import { Dialog } from '../generalPurposeComponents/Dialog';
import './Dialogs.css';

interface FeedbackReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedReasons: string[];
}

const FeedbackReportDialog: React.FC<FeedbackReportDialogProps> = ({ isOpen, onClose, selectedReasons }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
                <DialogPanel>
                    <button
                        style={{ position: 'absolute', top: '0px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    {selectedReasons.includes('reason1') ? (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>
                            Report sent successfully. If one of the missing products was on your shopping list and no other vendor sells it, an alert will appear. Click on it to choose alternatives.</p>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>Report sent successfully. We're sorry you're experiencing these issues :(</p>
                        </>
                    )}
                </DialogPanel>
        </Dialog>
    );
};

export default FeedbackReportDialog;