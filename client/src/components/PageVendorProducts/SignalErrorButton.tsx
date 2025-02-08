import { Market, Vendor, Product } from "../../models.ts";
import { Button } from '../generalPurposeComponents/Button.tsx';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import './Dialogs.css';
import globalContext, { AppContextProps } from "../../Context.tsx";
import {MessageSquareWarning} from "lucide-react";
import {ButtonBase} from "@mui/material";

interface SignalErrorButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    closeAfter: () => void;
    children?: React.ReactNode;
}

const SignalErrorButton: React.FC<SignalErrorButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, closeAfter, children }) => {

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);

    const missingProductsKey = `missingProducts_${selectedMarket.name}`;
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) ?? '[]');
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '[]');
    const missingProduct: string[] = JSON.parse(localStorage.getItem(missingProductsKey) ?? '[]');

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const context = useContext<AppContextProps>(globalContext);
    if (!context) {
        throw new Error("globalContext must be used within a Provider");
    }
    const { showToastMessage, askConfirmation, setPopupText, setConfirmationCallback } = context;

    // console.log(selectedProducts);

    const handleClick = () => {
        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = filteredVendors.find(vendor => vendor.products.some((product: { id: number; }) => product.id === productId));
                return vendor ? vendor.products.find((product: { id: number; }) => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));

        askConfirmation && askConfirmation(handleConfirm, <DialogContent products={products.filter((product): product is Product => product !== null && product !== undefined)} selectedReasons={selectedReasons} handleReasonSelect={handleReasonSelect} />, "Cancel", "Report");
    };

    const handleConfirm = useCallback(() => {
        let message = 'Report sent successfully. We\'re sorry you\'re experiencing these issues :(';
        if (selectedReasons.includes('reason1')) {
            selectedProducts.forEach((products, vendorId) => {
                products.forEach((productId: number) => {
                    filteredVendors.forEach(vendor => {
                        const product = vendor.products.find((product: { id: number; }) => product.id === productId);
                        if (vendor.id === vendorId && product) {
                            const productIndex = vendor.products.findIndex((p: { id: any; }) => p.id === product.id);
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
                                v.id !== vendorId && v.products.some((p: { id: number; }) => p.id === productId)
                            );

                            if (!otherVendorSellingProduct) {
                                // Handle the case where no other vendor sells the product
                                console.log(`No other vendor sells the product with id ${productId}`);
                                missingProduct.push(product.name);
                            } else {
                                // Add the product to the filtered vendor's product list if another vendor sells it
                                vendors.forEach(v => {
                                    if (v.id !== vendorId && v.products.some((p: { id: number; }) => p.id === productId)) {
                                        const filteredVendor = filteredVendors.find(fv => fv.id === v.id);
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
        // setSelectedReasons([]);
        closeAfter();
        showToastMessage && showToastMessage(message, 'success');
    }, [selectedReasons]);

    const handleReasonSelect = useCallback((reason: string) => {
        if (reason === 'reason1') {
            if (selectedReasons.includes('reason1'))
                setSelectedReasons([]);
            else
                setSelectedReasons([reason]);
        } else if (selectedReasons.includes('reason1'))
            setSelectedReasons([reason]);
        else
            setSelectedReasons(oldReasons => oldReasons.includes(reason) ? oldReasons.filter(r => r !== reason) : [...oldReasons, reason]);

        // console.log(reason);
        // console.log(selectedReasons);
    }, [selectedReasons]);

    useEffect(() => {
        setConfirmationCallback && setConfirmationCallback(() => { return handleConfirm });
    }, [handleConfirm]);

    useEffect(() => {
        setPopupText && setPopupText(<DialogContent products={productsSwitching} selectedReasons={selectedReasons} handleReasonSelect={handleReasonSelect} />);
    }, [selectedReasons]);

    return (
                <ButtonBase onClick={() => { handleClick() }} >
                    {
                        children ?
                            <div className="flex flex-col items-center gap-1 w-24">
                                <MessageSquareWarning size={20} />
                                {children}
                            </div>
                            :
                            <MessageSquareWarning size={20} />
                    }
                </ButtonBase>
    );
}

function DialogContent({ products, selectedReasons, handleReasonSelect }: Readonly<{ products: Product[], selectedReasons: string[], handleReasonSelect: (reason: string) => void }>) {
    return <>
        <span className="text-lg font-medium">Confirm Report</span>
        <span className="text-lg mb-2">Choose why you decided to report these products:</span>
        <span className="text-lg font-bold">{products.map((product) => product?.name).join(', ')}</span>
        <div className="flex flex-col mt-5 gap-2 items-center px-8">
            {[
                { id: 'reason1', label: 'Missing product/s' },
                { id: 'reason2', label: 'Poor quality' },
                { id: 'reason3', label: 'Price error' },
                { id: 'reason4', label: 'Improperly stored' }
            ].map(reason => (
                <Button
                    key={reason.id}
                    className="flex w-full animated items-center rounded-lg"
                    color={selectedReasons.includes(reason.id) ? "primary" : "bw"}
                    variant='outlined'
                    onClick={() => handleReasonSelect(reason.id)}
                >
                    <input
                        type="checkbox"
                        className="checkbox mr-2.5 pointer-events-none"
                        checked={selectedReasons.includes(reason.id)}
                        onChange={() => handleReasonSelect(reason.id)}
                    />
                    <span className="grow text-center">{reason.label}</span> {/* Aggiungi uno span per il testo */}
                </Button>
            ))}
        </div>
    </>
}

export default SignalErrorButton