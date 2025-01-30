import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';

interface SwitchButtonProps {
    selectedProducts: Map<number, any>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [productsWithoutAlternatives, setProductsWithoutAlternatives] = useState<Product[]>([]);
    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);

    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) || '[]');

    const selectedProduct = new Map<number, any>();
    selectedProduct.set(10, [10]);
    selectedProduct.set(1, [1, 2]);

    const handleClick = () => {
        setIsDialogOpen(true);

        const products = Array.from(selectedProduct.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = vendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });

        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
        console.log(products);
    };

    const handleConfirm = () => {
        console.log('SwitchButton clicked!');
        const productsWithoutAlternatives: Product[] = [];

        selectedProduct.forEach((products, vendorId) => {
            products.forEach((productId: number) => {
                let alternativeFound = false;

                vendors.forEach(vendor => {
                    const product = vendor.products.find(product => product.id === productId);
                    if (vendor.id !== vendorId && product) {
                        console.log(`Vendor ${vendor.id} also has product ${productId}`);
                        const existingVendor = filteredVendors.find(v => v.id === vendor.id);
                        if (existingVendor) {
                            existingVendor.products.push(product);
                        } else {
                            const newVendor = { ...vendor, products: [product] };
                            filteredVendors.push(newVendor);
                        }
                        alternativeFound = true;
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

        setProductsWithoutAlternatives(productsWithoutAlternatives);
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        setIsDialogOpen(false);
        setIsFeedbackDialogOpen(true);
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
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogPanel>
                    <h1 style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Switch</h1>
                    <p style={{ marginTop: '10px' }}>For the following products we will find other sellers in this marketplace that match your preferences:</p>
                    <div>
                        <div>
                            {productsSwitching.map((product, index) => (
                                <span key={index} style={{ fontWeight: 'bold' }}>
                                    {product.name}{index < productsSwitching.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <Button onClick={handleConfirm}>Confirm</Button>
                        <Button style={{ backgroundColor: 'red', color: 'white', borderColor: "red" }} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    </div>
                </DialogPanel>
            </Dialog>
            <Dialog open={isFeedbackDialogOpen} onClose={() => setIsFeedbackDialogOpen(false)}>
                <DialogPanel>
                    {productsWithoutAlternatives.length === 0 ? (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'green' }}>Success</h1>
                            <p style={{ marginTop: '10px' }}>All products have been successfully assigned to other sellers.</p>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'red' }}>Failed to Assign</h1>
                            <p style={{ marginTop: '10px' }}>The following products could not be assigned to other sellers:</p>
                            <div>
                                {productsWithoutAlternatives.map((product, index) => (
                                    <span key={index} style={{ fontWeight: 'bold' }}>
                                        {product.name}{index < productsWithoutAlternatives.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </DialogPanel>
            </Dialog>
        </>
    );
}

export default SwitchButton;