"use client";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import VendorCategoryList from "./VendorCategoryList.tsx";
import React, { useEffect, useMemo, useState } from "react";
import AddProductsButton from "./AddProductsButton.tsx";
import ProductListItem, { ProductListItemProps } from "./ProductListItem.tsx";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Sheet } from 'react-modal-sheet';
import VendorBadges from "./VendorBadges.tsx";
import { ButtonBase, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import ContextMenu, { ContextMenuProps } from "../generalPurposeComponents/ContextMenu.tsx";
import SwitchButton from "./SwitchButton.tsx";
import DeleteButton from "./DeleteButton.tsx";
import SignalErrorButton from "./SignalErrorButton.tsx";
import { Market, Vendor, Product } from "../../models.ts";
import { QRCodeSVG } from "qrcode.react";

interface PageVendorProductsParams {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void
    vendor: Vendor;
    theme: string;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    isFeedbackDialogOpen: string | null;
    setIsFeedbackDialogOpen: React.Dispatch<React.SetStateAction<string | null>>;
    setAddProductId: React.Dispatch<React.SetStateAction<number | null>>;
    selectedReasons: string[];
    setSelectedReasons: React.Dispatch<React.SetStateAction<string[]>>;
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
    productsWithoutAlternatives: Product[];
}

export default function PageVendorProducts({
    selectedMarket,
    setFilteredVendors,
    theme,
    isOpen,
    setIsOpen,
    vendor,
    isFeedbackDialogOpen,
    setIsFeedbackDialogOpen,
    setAddProductId,
    selectedReasons,
    setSelectedReasons,
    productsWithoutAlternatives,
    setProductsWithoutAlternatives,
}: Readonly<PageVendorProductsParams>) {
    const approot = document.getElementById("approot")!;

    const [isEditMode, setIsEditMode] = useState(false);

    const products = useMemo(() => vendor.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: parseFloat((product.price * vendor.priceMultiplier).toFixed(2)),
        image: product.image,
        editMode: false,
        isSelected: false,
        showPrice: true
    })), [vendor.products, vendor.priceMultiplier]);
    console.log('prod', products);

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps> | null>(null);

    useEffect(() => {
        closeAfter();
    }, [vendor.id]);



    const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>({
        onClose: () => {
            setContextMenuProps({ ...contextMenuProps, isOpen: false });
        },
        isOpen: false,
        x: 0,
        y: 0,
        items: [
            {
                label: "Delete",
                onClick: () => {
                    console.log("Delete");
                    setContextMenuProps({ ...contextMenuProps, isOpen: false });
                }
            },
            {
                label: "Edit",
                onClick: () => {
                    console.log("Edit");
                    setContextMenuProps({ ...contextMenuProps, isOpen: false });
                }
            }
        ]
    });

    const activeTab = localStorage.getItem('activeTab') ?? 'list';

    const handleClose = () => {
        setIsOpen(false);
        setIsEditMode(false);
        setSelectedProducts(null);
    }

    const openEditMode = (event: React.MouseEvent, productId: number) => {
        event.preventDefault();
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error("Product not found");
        }
        const newMap = new Map<number, ProductListItemProps>();
        newMap.set(productId, product);
        setSelectedProducts(newMap);
        setIsEditMode(true);
    };

    const exitEditMode = () => {
        setSelectedProducts(null);
        setIsEditMode(false);
    }

    async function addOrRemoveSelected(index: number) {
        if (!selectedProducts) {
            throw new Error("Selected products is null");
        }
        const product = products[index];
        if (selectedProducts.has(product.id)) {
            selectedProducts.delete(product.id);
            if (selectedProducts.size === 0) {
                setSelectedProducts(new Map());
                return
            }
        } else {
            selectedProducts.set(product.id, product);
        }
        setSelectedProducts(new Map(selectedProducts));
    }

    function closeAfter() {
        setIsEditMode(false);
        setSelectedProducts(null);
        console.log(closeAfter);
    }


    const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);

    function confirmSale() {
        setIsQrCodeDialogOpen(false);
        console.log("Sale confirmed");
        // TODO: Show toast message with the context in the other PR
    }

    return (
        <>
            <Sheet isOpen={isOpen} onClose={handleClose} mountPoint={approot} snapPoints={[1000, 600, 300, 100]}
                initialSnap={1}>
                <Sheet.Container>
                    <Sheet.Header
                        className="bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle rounded-t-md">
                    </Sheet.Header>
                    <Sheet.Content>
                        <Sheet.Scroller> {
                            <div className="h-full">
                                {/* ContextMenu */}
                                <ContextMenu {...contextMenuProps} />

                                {/* TopBar */}
                                {isEditMode ?
                                    <TopBar
                                        leftComponent={<ButtonBase className="text-md font-semibold"
                                            onClick={exitEditMode}><p
                                                className="m-0 p-0">Cancel</p></ButtonBase>}
                                        centerComponent={<h1
                                            className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (selectedProducts.size + " Selected") : ""}</h1>}
                                        rightComponent={
                                            <>
                                                {
                                                    selectedProducts && selectedProducts.size === products.length ?
                                                        <div className="w-8 h-16 flex items-center justify-center"
                                                            onClick={
                                                                () => {
                                                                    setSelectedProducts(new Map());
                                                                }
                                                            }>
                                                            <div
                                                                className="rounded-full text-green-500 h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                                                <svg
                                                                    className="h-6 w-6 text-black dark:text-white translate-y-[-0.3em] translate-x-[-0.1em] transition-all duration-300"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                        strokeWidth="3"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div
                                                            className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300"
                                                            onClick={
                                                                () => {
                                                                    setSelectedProducts(new Map(products.map(p => [p.id, p])));
                                                                }
                                                            }>
                                                            <div
                                                                className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                                            </div>
                                                        </div>

                                                }

                                                {selectedProducts && selectedProducts.size > 0 &&
                                                    <>
                                                        <SwitchButton
                                                            productsWithoutAlternatives={productsWithoutAlternatives} setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                            selectedMarket={selectedMarket}
                                                            isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen}
                                                            selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                            setFilteredVendors={setFilteredVendors}
                                                            theme={theme} closeAfter={closeAfter} />
                                                        <SignalErrorButton
                                                            selectedReasons={selectedReasons} setSelectedReasons={setSelectedReasons}
                                                            isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen}
                                                            selectedMarket={selectedMarket}
                                                            selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                            setFilteredVendors={setFilteredVendors}
                                                            theme={theme} closeAfter={closeAfter} />
                                                        <DeleteButton
                                                            isFeedbackDialogOpen={isFeedbackDialogOpen}
                                                            setIsFeedbackDialogOpen={setIsFeedbackDialogOpen}
                                                            selectedMarket={selectedMarket}
                                                            selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                            setFilteredVendors={setFilteredVendors}
                                                            theme={theme} closeAfter={closeAfter} />
                                                    </>}

                                            </>
                                        }>
                                    </TopBar>
                                    :
                                    <TopBar
                                        centerComponent={<h1
                                            className="line-clamp-1 m-0 p-0 text-2xl titleFont font-bold">{vendor.name}</h1>}
                                        rightComponent={
                                            <div className="flex flex-row">
                                                <IconButton onClick={() => setIsQrCodeDialogOpen(true)}>
                                                    <QrCodeScannerIcon className="text-black dark:text-white" />
                                                </IconButton>
                                            </div>
                                        }>
                                    </TopBar>
                                }
                                <div
                                    className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle px-6 pt-[3.45em] flex flex-col gap-4">
                                    {/* Vendor's Categories */}
                                    <div className="w-full">
                                        <VendorCategoryList categories={vendor.categories} />
                                    </div>

                                    <div className="w-full">
                                        <VendorBadges market={vendor.market} quality={vendor.quality_rating}
                                            cordiality={vendor.cordiality_rating}
                                            convenience={vendor.convenience_rating} />
                                    </div>

                                    <div className="w-full flex-1">
                                        {/* Product list top bar */}
                                        <div className="w-full flex flex-row justify-between items-center">
                                            <p className="m-0 p-0">Your planned purchases</p>
                                            <div onClick={() => {
                                                setAddProductId(vendor.id);
                                            }
                                            }><AddProductsButton></AddProductsButton></div>
                                        </div>
                                        {/* Product list */}
                                        <div className="w-full flex flex-col gap-3 mt-4 pb-[4rem]">
                                            {products.map((product, index) => (
                                                isEditMode ?
                                                    <ButtonBase key={product.id} component="div"
                                                        onClick={() => {
                                                            addOrRemoveSelected(index);
                                                        }}
                                                    >
                                                        <ProductListItem key={index} {...product} editMode={true}
                                                            isSelected={
                                                                selectedProducts ? selectedProducts.has(product.id) : false
                                                            } />
                                                    </ButtonBase>
                                                    :
                                                    <ButtonBase key={product.id} component="div"
                                                        onContextMenu={(e) => {
                                                            openEditMode(e, product.id);
                                                        }}
                                                    >
                                                        <ProductListItem key={index} {...product} editMode={false} />
                                                    </ButtonBase>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                {
                    activeTab != "map" ?
                        <Sheet.Backdrop onTap={() => handleClose()} style={{ backgroundColor: "transparent" }} /> : <></>
                }
            </Sheet>
            <Dialog open={isQrCodeDialogOpen} onClose={() => setIsQrCodeDialogOpen(false)} onClick={confirmSale}>
                {/* <DialogTitle>QR Code</DialogTitle> */}
                <DialogContent className="flex flex-col items-center">
                    <QRCodeSVG value="http://google.com" />
                    <p>Show this to the vendor!</p>
                </DialogContent>
            </Dialog>
        </>
    );
}