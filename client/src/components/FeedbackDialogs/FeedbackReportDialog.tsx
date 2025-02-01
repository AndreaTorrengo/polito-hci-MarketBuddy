import React from 'react';
import { Dialog, DialogPanel } from '@tremor/react';
import './Dialogs.css';

interface FeedbackReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    theme: string;
    selectedReasons: string[];
}

const FeedbackReportDialog: React.FC<FeedbackReportDialogProps> = ({ isOpen, onClose, theme, selectedReasons }) => {
    return (
        <>
            <Dialog className={theme === 'dark' ? 'dark z-[10000000]' : 'z-[10000000]'} open={isOpen} onClose={() => { onClose }}>
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
                            <p className="message-text" style={{ marginTop: '10px' }}>Report sent successfully. If one of the missing products was part of your shopping list the alert will show you alternatives.</p>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>Report sent successfully. We're sorry you're experiencing these issues :(</p>
                        </>
                    )}
                </DialogPanel>
            </Dialog>
        </>
    );
};

export default FeedbackReportDialog;