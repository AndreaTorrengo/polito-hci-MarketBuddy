import SmallIconButton from "../generalPurposeComponents/SmallIconButton";
import { Market, Vendor, Product } from "../../models";
import { Button, Dialog, DialogPanel } from '@tremor/react';
import React, { useState } from 'react';
import './SwitchButton.css';


interface DeleteButtonProps {
    selectedProducts: Map<number, number[]>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string,
    closeAfter: () => void;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ selectedProducts, selectedMarket, setFilteredVendors, theme, closeAfter }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    const [productsSwitching, setProductsSwitching] = useState<Product[]>([]);
    const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) || '[]');

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

    const handleVendorDelete = () => {
        if (vendorToDelete !== null && vendorToDelete !== -1) {
            if (vendorToDelete !== null) {
                filteredVendors.splice(vendorToDelete, 1); // Remove the vendor from the filtered vendors list
                setVendorToDelete(null);
            }

        }
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));

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
                            const vendorIndex = filteredVendors.findIndex(v => v.id === vendor.id);
                            if (vendorIndex !== -1) {
                                setVendorToDelete(vendorIndex) // Remove the vendor from the filtered vendors list
                            }
                        }
                    }
                });
            });
        });


        setIsDialogOpen(false);
        setIsFeedbackDialogOpen(true);
        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
    };
    return (
        <>
            <SmallIconButton onClick={() => { handleClick() }} >
                <div className="flex items-center justify-center h-5 w-5">
                    <svg fill="#db1f1f" width="2.5em" height="2.5em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" /></svg>
                </div>
            </SmallIconButton>
            <Dialog className={theme === 'dark' ? 'dark z-[10000000]' : 'z-[10000000]'} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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

                    <div style={{ display: 'flex', justifyContent: 'right', gap: '10px', marginTop: '20px' }}>
                        <Button className="button-cancel" style={{ backgroundColor: 'transparent', borderColor: theme === 'dark' ? 'white' : 'black', color: theme === 'dark' ? 'white' : 'black', borderWidth: '1px' }} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button className="button" onClick={handleConfirm}>Confirm</Button>
                    </div>
                </DialogPanel>
            </Dialog>
            <Dialog className={theme === 'dark' ? 'dark z-[10000000]' : 'z-[10000000]'} open={isFeedbackDialogOpen} onClose={() => { setIsFeedbackDialogOpen(false); closeAfter(); handleVendorDelete(); }}>
                <DialogPanel>

                    <>
                        <button
                            style={{ position: 'absolute', top: '0px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            onClick={() => setIsFeedbackDialogOpen(false)}
                        >
                            &times;
                        </button>
                        <h1 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#32CD32' }}>Success</h1>
                        <p className="message-text" style={{ marginTop: '10px' }}>Selected products have been succesfully deleted from your shopping list</p>
                    </>


                </DialogPanel>
            </Dialog>
        </>
    );
}

export default DeleteButton;