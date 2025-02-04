import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Button } from '../generalPurposeComponents/Button';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";
import { ProductListItemProps } from "./ProductListItem";

interface SignalErrorButtonProps {
    selectedProducts: Map<number, ProductListItemProps>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    closeAfter: () => void;
}

const SignalErrorButton: React.FC<SignalErrorButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, closeAfter }) => {

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);

    const missingProductsKey = `missingProducts_${selectedMarket.name}`;
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) ?? '[]');
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '[]');
    const missingProduct: string[] = JSON.parse(localStorage.getItem(missingProductsKey) ?? '[]');

    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const { showToastMessage, askConfirmation, setPopupText } = useContext(globalContext) || {};

    const handleClick = () => {
        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = filteredVendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));

        askConfirmation && askConfirmation(handleConfirm, <DialogContent products={products} selectedReasons={selectedReasons} handleReasonSelect={handleReasonSelect} />);
    };

    const handleConfirm = useCallback(() => {
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
        setSelectedReasons([]);
        closeAfter();
        showToastMessage && showToastMessage(message, 'success');
    }, [filteredVendors, filteredVendorsKey, missingProduct, missingProductsKey, selectedProducts, selectedReasons, setFilteredVendors, showToastMessage, vendors]);

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
    }, [selectedReasons]);

    useEffect(() => {
        setPopupText && setPopupText(<DialogContent products={productsSwitching} selectedReasons={selectedReasons} handleReasonSelect={handleReasonSelect} />);
    }, [productsSwitching, selectedReasons, setPopupText]);

    return (
        <SmallIconButton onClick={() => { handleClick() }} >
            <div className="flex items-center justify-center h-5 w-5">
                <svg className="w-10 h-10 fill-current text-black dark:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z" />
                </svg>
            </div>
        </SmallIconButton>
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
                { id: 'reason3', label: 'Price too high' },
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
                        className="checkbox mr-2.5"
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