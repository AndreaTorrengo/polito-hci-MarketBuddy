import { Market, Vendor, Product } from "../../models";
import { Dialog, DialogPanel } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import React, { useContext, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";
import {Trash2} from "lucide-react";
import {ButtonBase} from "@mui/material";


interface DeleteButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string,
    closeAfter: () => void;
    children?: React.ReactNode;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, closeAfter, children }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');

    const { showToastMessage, askConfirmation } = useContext(globalContext) || {};

    const handleClick = () => {
        // setIsDialogOpen(true);

        const products = Array.from(selectedProducts.values()).flatMap(productIds => {
            return productIds.map((productId: number) => {
                const vendor = filteredVendors.find(vendor => vendor.products.some(product => product.id === productId));
                return vendor ? vendor.products.find(product => product.id === productId) : null;
            });
        });
        setProductsSwitching(products.filter((product): product is Product => product !== null && product !== undefined));
        askConfirmation && askConfirmation(handleConfirm,
            <div className="flex flex-col">
                <span className="text-lg font-medium">Confirm Delete</span>
                <span className="text-lg mb-2">The following products will be deleted from your shopping list:</span>
                <span className="text-lg font-bold">{products.map((product) => product?.name).join(', ')}</span>
            </div>
        );
    };


    const handleConfirm = () => {
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
                            const index = filteredVendors.findIndex(v => v.id === vendor.id);
                            if (index !== -1) {
                                filteredVendors.splice(index, 1); // Remove the vendor from the filtered vendors list
                            }
                        }
                    }
                });
            });
        });

        setIsDialogOpen(false);
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        setIsDialogOpen(false);
        showToastMessage && showToastMessage("Selected products have been succesfully deleted from your shopping list", "success");
        closeAfter();
    };

    return (
        <>
            <ButtonBase onClick={handleClick}>
                {
                    children ?
                        <div className="flex flex-col items-center gap-1 w-24">
                            <Trash2 size={20} color='red' />
                            {children}
                        </div>
                        :
                            <Trash2 size={20} color='red' />
                }
            </ButtonBase>
            <Dialog className={theme === 'dark' ? 'dark' : ''} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogPanel>
                    <h1 className="confirm-text" style={{ fontWeight: 'bold', fontSize: '1rem' }}>Confirm Delete</h1>
                    <p className="message-text" style={{ marginTop: '10px' }}>The following products will be deleted from your shopping list:</p>
                    <div>
                        <div className="products-text">
                            {productsSwitching.map((product, index) => (
                                <span key={index} style={{ fontWeight: 'bold' }}>
                                    {product.name}{index < productsSwitching.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-right gap-3.5 mt-5">
                        <Button color='primary' variant="outlined" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button color='primary' variant="contained" onClick={handleConfirm}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
};

export default DeleteButton;