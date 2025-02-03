import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Dialog, DialogPanel } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import React, { useContext, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";

interface SwitchButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string,
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, setProductsWithoutAlternatives }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '[]');
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) ?? '[]');

    const showToastMessage = useContext(globalContext)?.showToastMessage;

    const handleClick = () => {
        setIsDialogOpen(true);

        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = vendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
    };

    const handleConfirm = () => {

        const productsWithoutAlternatives: Product[] = [];

        selectedProducts.forEach((products, vendorId) => {
            products.forEach((productId: number) => {
                let alternativeFound = false;

                vendors.forEach(vendor => {
                    const product = vendor.products.find(product => product.id === productId);
                    if (vendor.id !== vendorId && product) {
                        const existingVendor = filteredVendors.find(v => v.id === vendor.id);
                        if (existingVendor) {
                            existingVendor.products.push(product);
                        } else {
                            const newVendor = { ...vendor, products: [product] };
                            filteredVendors.push(newVendor);
                        }
                        alternativeFound = true;

                        // Remove the product from the previous vendor
                        const previousVendor = filteredVendors.find(v => v.id === vendorId);
                        if (previousVendor) {
                            previousVendor.products = previousVendor.products.filter(p => p.id !== product.id);
                            // If the previous vendor has no more products, remove the vendor
                            if (previousVendor.products.length === 0) {
                                const updatedFilteredVendors = filteredVendors.filter(v => v.id !== vendorId);
                                filteredVendors.length = 0;
                                filteredVendors.push(...updatedFilteredVendors);
                            }
                        }
                    }
                });

                if (!alternativeFound) {
                    const product = vendors.find(v => v.id === vendorId)?.products.find(p => p.id === productId);
                    if (product) {
                        productsWithoutAlternatives.push(product);
                    }
                }
            });
        });

        let message = 'All products have been successfully assigned to other sellers.';
        let variant = 'success';
        if (productsWithoutAlternatives.length !== 0) {
            message = 'The following products could not be assigned to other sellers: ';
            productsWithoutAlternatives.forEach(product => {
                message += product.name + ', ';
            });
            message = message.slice(0, -2);
            variant = 'warning';
        }


        setProductsWithoutAlternatives(productsWithoutAlternatives);
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        setIsDialogOpen(false);
        showToastMessage?.(message, variant);
    };

    return (
        <>
            <SmallIconButton onClick={handleClick}>
                <div className="flex items-center justify-center h-5 w-5 text-black dark:text-white">
                    <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </SmallIconButton>
            <Dialog className={theme === 'dark' ? 'dark' : ''} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Switch</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>For the following products we will find other sellers in this marketplace that match your preferences:</p>
                    <div>
                        <div className="products-text">
                            {productsSwitching.map((product, index) => (
                                <span key={index} style={{ fontWeight: 'bold' }}>
                                    {product.name}{index < productsSwitching.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-right gap-2.5 mt-5">
                        <Button variant='outlined' color='primary' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button variant='contained' color='primary' onClick={handleConfirm}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
}

export default SwitchButton;