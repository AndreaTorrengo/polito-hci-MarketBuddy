import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Dialog, DialogPanel } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import React, { useContext, useState } from 'react';
import './Dialogs.css';
import globalContext from "../../Context";


interface DeleteButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string,
    closeAfter: () => void;
    isFeedbackDialogOpen: string | null;
    setIsFeedbackDialogOpen: React.Dispatch<React.SetStateAction<string | null>>;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, closeAfter, isFeedbackDialogOpen, setIsFeedbackDialogOpen }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');

    const showToastMessage = useContext(globalContext)?.showToastMessage;

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
        setIsFeedbackDialogOpen('delete');
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        setIsDialogOpen(false);
        showToastMessage && showToastMessage("Selected products have been succesfully deleted from your shopping list", "success");
        closeAfter();
    };

    return (
        <>
            <SmallIconButton onClick={handleClick}>
                <div className="flex items-center justify-center h-5 w-5">
                    <svg fill="#db1f1f" width="2.5em" height="2.5em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" /></svg>
                </div>
            </SmallIconButton>
            <Dialog className={theme === 'dark' ? 'dark z-40' : 'z-40'} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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