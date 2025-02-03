"use client";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import VendorCategoryList from "./VendorCategoryList.tsx";
import React, { useMemo, useState } from "react";
import AddProductsButton from "./AddProductsButton.tsx";
import ProductListItem, { ProductListItemProps } from "./ProductListItem.tsx";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Sheet } from 'react-modal-sheet';
import VendorBadges from "./VendorBadges.tsx";
import { ButtonBase } from "@mui/material";
import ContextMenu, { ContextMenuProps } from "../generalPurposeComponents/ContextMenu.tsx";
import SwitchButton from "./SwitchButton.tsx";
import DeleteButton from "./DeleteButton.tsx";
import SignalErrorButton from "./SignalErrorButton.tsx";
import { Button } from "../generalPurposeComponents/Button.tsx";
import { Market, Vendor, Product } from "../../models.ts";

interface PageVendorProductsParams {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void
    vendor: Vendor;
    theme: string;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
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
    setAddProductId,
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

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps> | null>(null);

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

    const activeTab = localStorage.getItem('activeTab') || 'list';

    const onLongPress = (event: React.MouseEvent, productId: number) => {
        event.preventDefault();
        setContextMenuProps({ ...contextMenuProps, isOpen: true, x: event.clientX, y: event.clientY });
    };

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

    return (
        <Sheet isOpen={isOpen} onClose={handleClose} mountPoint={approot} detent="content-height" snapPoints={[1.0, 0.7, 0.5, 0.2]} className="!z-0">
            <Sheet.Container>
                <Sheet.Header
                    className="dark:bg-dark-tremor-background">
                </Sheet.Header>
                <Sheet.Content className="dark:bg-dark-tremor-background">
                    {/* ContextMenu */}
                    <div className="px-5">
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
                                                <SwitchButton selectedMarket={selectedMarket}
                                                    selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                setFilteredVendors={setFilteredVendors}
                                                setSelectedProducts={setSelectedProducts}
                                                setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                theme={theme}
                                            />
                                            <SignalErrorButton
                                                selectedMarket={selectedMarket}
                                                selectedProducts={selectedProducts}
                                                setFilteredVendors={setFilteredVendors}
                                                setSelectedProducts={setSelectedProducts}
                                                theme={theme}
                                            />
                                                <DeleteButton selectedMarket={selectedMarket}
                                                selectedProducts={selectedProducts} s
                                                setFilteredVendors={setFilteredVendors}
                                                theme={theme}
                                            />
                                            </>}

                                    </>
                                }>
                            </TopBar>
                            :
                            <TopBar
                                leftComponent={<h2
                                    className="line-clamp-1 m-0 p-0 text-2xl font-bold">{vendor.name}</h2>}
                                rightComponent={
                                    <Button variant="outlined" color="bw">
                                        <div className="flex flex-row items-center gap-4">
                                            <span>Confirm Purchase</span>
                                            <QrCodeScannerIcon className="text-black dark:text-white" />
                                        </div>
                                    </Button>
                                }>
                            </TopBar>
                        }
                    </div>
                    <Sheet.Scroller draggableAt="top" className="px-5 pb-14"> {
                        <div
                            className="w-full h-full px-1 mt-4 flex flex-col gap-4">
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
                                    <AddProductsButton onClick={() => setAddProductId(vendor.id)} />
                                </div>
                                {/* Product list */}
                                <div key={vendor.id} className="w-full flex flex-col gap-3 mt-4">
                                    {products.map((product, index) => (
                                        isEditMode ?
                                            <ButtonBase key={product.id} component="div"
                                                onClick={() => {
                                                    addOrRemoveSelected(index);
                                                }}
                                            >
                                                <ProductListItem key={product.id} {...product} editMode={true}
                                                    isSelected={
                                                        selectedProducts ? selectedProducts.has(product.id) : false
                                                    } />
                                            </ButtonBase>
                                            :
                                            <ButtonBase key={product.id} component="div"
                                                onContextMenu={(e) => {
                                                    //onLongPress(e, index);
                                                    openEditMode(e, product.id);
                                                }}
                                            >
                                                <ProductListItem key={product.id} {...product} editMode={false} />
                                            </ButtonBase>
                                    ))}
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
        </Sheet >
    );
}