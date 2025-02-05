import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Dialog, DialogPanel } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import React, { useContext, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";
import { ProductListItemProps } from "./ProductListItem";
import { ArrowLeftRight, Replace, ReplaceAll } from "lucide-react";

interface SwitchButtonProps {
    selectedProducts: Map<number, ProductListItemProps[] | number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    closeAfter: () => void;
    theme: string,
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, setProductsWithoutAlternatives, closeAfter }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '[]');
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) ?? '[]');

    const { showToastMessage, askConfirmation } = useContext(globalContext) || {};

    const handleClick = () => {
        // setIsDialogOpen(true);

        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return (productIds as number[]).map((productId: number) => {
                const vendor = vendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
        askConfirmation && askConfirmation(handleConfirm,
            <>
                {/* The following products will be switched to other sellers */}
                <span className="text-lg font-medium">Confirm Switch</span>
                <span className="text-lg mb-2">For the following products we will find other sellers in this marketplace that match your preferences:</span>
                <span className="text-lg font-bold">{products.map((product) => product?.name).join(', ')}</span>
            </>
        );
    };

    const handleConfirm = () => {

        const productsWithoutAlternatives: Product[] = [];

        selectedProducts.forEach((products, vendorId) => {
            (products as number[]).forEach((productId: number) => {
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
        closeAfter();
        showToastMessage?.(message, variant);
    };

    return (
        <>
            <Button className="px-0" onClick={handleClick}>
                <ArrowLeftRight size={20} />
            </Button>
            <Dialog className={theme === 'dark' ? 'dark' : ''} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Switch</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>We will find other sellers in this marketplace that match your preferences for the following products :</p>
                    <div>
                        <div className="products-text">
                            {productsSwitching.map((product, index) => (
                                <span key={product.id} style={{ fontWeight: 'bold' }}>
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