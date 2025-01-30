import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';
import './SignalErrorButton.css';

interface SignalErrorButtonProps {
    selectedProducts: Map<number, any>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string
}
const SignalErrorButton: React.FC<SignalErrorButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);

    const missingProductsKey = `missingProducts_${selectedMarket.name}`;
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) || '[]');
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');
    const missingProduct: string[] = JSON.parse(localStorage.getItem(missingProductsKey) || '[]');

    const selectedProduct = new Map<number, any>();
    selectedProduct.set(10, [10]);
    selectedProduct.set(4, [1, 2]);

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

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

        const products = Array.from(selectedProduct.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = filteredVendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
    };

    const handleConfirm = () => {
        if (selectedReasons.includes('reason1')) {
            selectedProduct.forEach((products, vendorId) => {
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
        }
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        localStorage.setItem(missingProductsKey, JSON.stringify(missingProduct));
        setIsDialogOpen(false);
        setIsFeedbackDialogOpen(true);
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
            <Dialog className={theme === 'dark' ? 'dark' : ''} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <Button
                            className="button"
                            style={{ backgroundColor: selectedReasons.includes('reason1') ? '#4E80EE' : '#DDDDDD', color: selectedReasons.includes('reason1') ? '#FFFFFF' : '#000000', padding: '8px 12px', fontSize: '0.875rem', width: '200px' }}
                            onClick={() => handleReasonSelect('reason1')}
                        >
                            Missing product/s
                        </Button>
                        <Button
                            className="button"
                            style={{ backgroundColor: selectedReasons.includes('reason2') ? '#4E80EE' : '#DDDDDD', color: selectedReasons.includes('reason2') ? '#FFFFFF' : '#000000', padding: '8px 12px', fontSize: '0.875rem', width: '200px' }}
                            onClick={() => handleReasonSelect('reason2')}
                        >
                            Poor quality
                        </Button>
                        <Button
                            className="button"
                            style={{ backgroundColor: selectedReasons.includes('reason3') ? '#4E80EE' : '#DDDDDD', color: selectedReasons.includes('reason3') ? '#FFFFFF' : '#000000', padding: '8px 12px', fontSize: '0.875rem', width: '200px' }}
                            onClick={() => handleReasonSelect('reason3')}
                        >
                            Price too high
                        </Button>
                        <Button
                            className="button"
                            style={{ backgroundColor: selectedReasons.includes('reason4') ? '#4E80EE' : '#DDDDDD', color: selectedReasons.includes('reason4') ? '#FFFFFF' : '#000000', padding: '8px 12px', fontSize: '0.875rem', width: '200px' }}
                            onClick={() => handleReasonSelect('reason4')}
                        >
                            Improperly stored
                        </Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <Button className="button" onClick={handleConfirm}>Confirm</Button>
                        <Button className="button" style={{ backgroundColor: '#DD524C', borderColor: "#DD524C" }} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    </div>
                </DialogPanel>
            </Dialog>
            <Dialog className={theme === 'dark' ? 'dark' : ''} open={isFeedbackDialogOpen} onClose={() => setIsFeedbackDialogOpen(false)}>
                <DialogPanel>
                    {selectedReasons.includes('reason1') ? (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#00FF00' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>Report sent successfully. If one of the missing products was part of your shopping list the alert will show you alternatives.</p>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#00FF00' }}>Success</h1>
                            <p className="message-text" style={{ marginTop: '10px' }}>Report sent successfully. We're sorry you're experiencing these issues :(</p>
                        </>
                    )}
                </DialogPanel>
            </Dialog>
        </>
    );
}

export default SignalErrorButton