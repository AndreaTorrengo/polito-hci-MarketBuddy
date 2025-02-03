import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Dialog, DialogPanel } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import React, { useContext, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";

interface SignalErrorButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string,
    closeAfter: () => void;
    selectedReasons: string[];
    setSelectedReasons: React.Dispatch<React.SetStateAction<string[]>>;
    isFeedbackDialogOpen: string | null;
    setIsFeedbackDialogOpen: React.Dispatch<React.SetStateAction<string | null>>;
}
const SignalErrorButton: React.FC<SignalErrorButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, closeAfter, selectedReasons, setSelectedReasons, isFeedbackDialogOpen, setIsFeedbackDialogOpen }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);

    const missingProductsKey = `missingProducts_${selectedMarket.name}`;
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) || '[]');
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');
    const missingProduct: string[] = JSON.parse(localStorage.getItem(missingProductsKey) || '[]');

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const showToastMessage = useContext(globalContext)?.showToastMessage;

    const handleReasonSelect = (reason: string) => {
        if (reason === 'reason1') {
            setSelectedReasons(['reason1']);
        } else {
            setSelectedReasons(prevSelectedReasons => {
                if (prevSelectedReasons.includes('reason1')) {
                    return [reason];
                }
                return prevSelectedReasons.includes(reason)
                    ? prevSelectedReasons.filter(r => r !== reason)
                    : [...prevSelectedReasons, reason];
            });
        }
    };

    const handleClick = () => {
        setIsDialogOpen(true);

        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = filteredVendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
    };

    const handleConfirm = () => {
        let message = 'Report sent successfully. We\'re sorry you\'re experiencing these issues :(';
        if (selectedReasons.includes('reason1')) {
            selectedProducts.forEach((products, vendorId) => {
                products.forEach((productId: number) => {
                    filteredVendors.forEach(vendor => {
                        const product = vendor.products.find(product => product.id === productId);
                        if (vendor.id === vendorId && product) {
                            const productIndex = vendor.products.findIndex(p => p.id === product.id);
                            if (productIndex !== -1) {
                                vendor.products.splice(productIndex, 1); // Remove the product from the vendor's product list
                            }
                            if (vendor.products.length === 0) {
                                const vendorIndex = filteredVendors.findIndex(v => v.id === vendor.id);
                                if (vendorIndex !== -1) {
                                    filteredVendors.splice(vendorIndex, 1); // Remove the vendor from the filtered vendors list
                                }
                            }

                            // Check if any other vendor sells the removed product
                            const otherVendorSellingProduct = vendors.some(v =>
                                v.id !== vendorId && v.products.some(p => p.id === productId)
                            );

                            if (!otherVendorSellingProduct) {
                                // Handle the case where no other vendor sells the product
                                console.log(`No other vendor sells the product with id ${productId}`);
                                missingProduct.push(product.name);
                            } else {
                                // Add the product to the filtered vendor's product list if another vendor sells it
                                vendors.forEach(v => {
                                    if (v.id !== vendorId && v.products.some(p => p.id === productId)) {
                                        let filteredVendor = filteredVendors.find(fv => fv.id === v.id);
                                        if (filteredVendor) {
                                            filteredVendor.products.push(product);
                                        } else {
                                            // Add new vendor to filteredVendors with the product
                                            filteredVendors.push({
                                                ...v,
                                                products: [product]
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            });
            message = 'Report sent successfully. If one of the missing products was part of your shopping list the alert will show you alternatives.';
        }
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        localStorage.setItem(missingProductsKey, JSON.stringify(missingProduct));
        setIsDialogOpen(false);
        showToastMessage && showToastMessage(message, 'success');
        setIsFeedbackDialogOpen('report');
        closeAfter();
    };
    return (
        <>
            <SmallIconButton onClick={() => { handleClick() }} >
                <div className="flex items-center justify-center h-5 w-5">
                    <svg className="w-10 h-10 fill-current text-black dark:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z" />
                    </svg>
                </div>
            </SmallIconButton>
            <Dialog className={theme === 'dark' ? 'dark z-40' : 'z-40'} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Report</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>Choose why you decided to report these products:</p>
                    <div>
                        <div className="products-text">
                            {productsSwitching.map((product, index) => (
                                <span key={index} style={{ fontWeight: 'bold' }}>
                                    {product.name}{index < productsSwitching.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col mt-5 gap-2 items-center px8" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {[
                            { id: 'reason1', label: 'Missing product/s' },
                            { id: 'reason2', label: 'Poor quality' },
                            { id: 'reason3', label: 'Price too high' },
                            { id: 'reason4', label: 'Improperly stored' }
                        ].map(reason => (
                            <Button
                                key={reason.id}
                                className="flex w-full animated items-center justify-between"
                                color="secondary"
                                variant={selectedReasons.includes(reason.id) ? 'contained' : 'outlined'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between', // Cambia justifyContent a space-between
                                    backgroundColor: 'transparent',
                                    border: '2px solid ' + (selectedReasons.includes(reason.id) ? (theme === 'dark' ? '#FFFFFF' : '#000000') : (theme === 'dark' ? '#bfbfbf' : '#666666')),
                                    color: selectedReasons.includes(reason.id) ? (theme === 'dark' ? '#FFFFFF' : '#000000') : (theme === 'dark' ? '#bfbfbf' : '#666666'),
                                    padding: '8px 12px',
                                    fontSize: '0.875rem',
                                    width: '200px',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onClick={() => handleReasonSelect(reason.id)}
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={selectedReasons.includes(reason.id)}
                                    onChange={() => handleReasonSelect(reason.id)}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: selectedReasons.includes(reason.id) ? (theme === 'dark' ? '#000000' : '#000000') : (theme === 'dark' ? '#000000' : '#FFFFFF'),
                                        border: '1px solid ' + (selectedReasons.includes(reason.id) ? (theme === 'dark' ? '#FFFFFF' : '#000000') : (theme === 'dark' ? '#bfbfbf' : '#666666')),
                                    }}
                                />
                                <span style={{ flexGrow: 1, textAlign: 'center' }}>{reason.label}</span> {/* Aggiungi uno span per il testo */}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-right gap-4 mt-5">
                        <Button color="primary" variant="outlined" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button color="primary" variant="contained" onClick={handleConfirm}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog >

        </>
    );
}

export default SignalErrorButton