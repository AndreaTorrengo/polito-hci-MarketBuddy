"use client";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import VendorCategoryList from "./VendorCategoryList.tsx";
import React, { useContext, useMemo, useState } from "react";
import AddProductsButton from "./AddProductsButton.tsx";
import ProductListItem, { ProductListItemProps } from "./ProductListItem.tsx";
import { Sheet } from 'react-modal-sheet';
import VendorBadges from "./VendorBadges.tsx";
import { ButtonBase, Dialog, DialogContent } from "@mui/material";
import ContextMenu, { ContextMenuProps } from "../generalPurposeComponents/ContextMenu.tsx";
import SwitchButton from "./SwitchButton.tsx";
import DeleteButton from "./DeleteButton.tsx";
import SignalErrorButton from "./SignalErrorButton.tsx";
import { Button } from "../generalPurposeComponents/Button.tsx";
import { Market, Vendor, Product } from "../../models.ts";
import { QRCodeSVG } from "qrcode.react";
import globalContext from "../../Context.tsx";
import { ArrowUpFromDot, Circle, CircleCheckBig, ScanQrCode } from "lucide-react";
import { UserData } from "../PageProfile/UserData.tsx";

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
    filteredVendors: Vendor[];
    origin: "map" | "list";
    changeTab?: (tab?: string) => void;
    setVendorBadgePositionCallback?: React.Dispatch<React.SetStateAction<Vendor | null>>;
    setUserdata: React.Dispatch<React.SetStateAction<UserData>>;
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
    filteredVendors,
    origin,
    changeTab,
    setVendorBadgePositionCallback,
    setUserdata,
}: Readonly<PageVendorProductsParams>) {
    const approot = document.getElementById("approot")!;

    const [isEditMode, setIsEditMode] = useState(false);

    const products = useMemo(() => vendor.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: parseFloat((product.price * vendor.priceMultiplier).toFixed(2)),
        image: product.image,
        points: product.points,
        editMode: false,
        isSelected: false,
        showPrice: true
    })), [vendor.products, vendor.priceMultiplier]);

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps> | null>(null);

    const { showToastMessage } = useContext(globalContext) || {};

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


    const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);

    function openQrCodeDialog() {
        handleClose();
        setIsQrCodeDialogOpen(true);
    }

    function confirmSale() {
        setIsQrCodeDialogOpen(false);
        setIsOpen(false);
        setFilteredVendors(filteredVendors.filter(v => v.id !== vendor.id));
        showToastMessage && showToastMessage("Sale confirmed!", "success");

        // Update stats
        if (products != null) {
            setUserdata((userdata: UserData) => {
                const udCopy = Object.assign(new UserData(), userdata);
                const coinsFromProducts = Array.from(products.values()).reduce((acc, product) => {
                    if (product.points == undefined)
                        return acc;
                    return acc + product.points;
                }, 0);
                //console.log("Coins from selected products: ", coinsFromProducts);
                udCopy.incrCoins(coinsFromProducts);
                return udCopy;
            });
        }
    }


    const [showUpArrow, setShowUpArrow] = useState(false);


    return (
        <>
            <Sheet isOpen={isOpen} onClose={handleClose} mountPoint={approot} detent={origin === 'list' ? "content-height" : "full-height"} initialSnap={origin === "map" ? 2 : undefined} snapPoints={[1.0, 0.6, 0.43, 0.39, 0.24]} onSnap={(snapIndex) => { snapIndex == 2 ? setShowUpArrow(true) : setShowUpArrow(false) }} className="!z-10">
                <Sheet.Container>
                    <Sheet.Header
                        className="dark:bg-dark-tremor-background">
                    </Sheet.Header>
                    <Sheet.Content className="dark:bg-dark-tremor-background pb-10">
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
                                        <div className="flex gap-3 items-center">
                                            {
                                                selectedProducts && selectedProducts.size === products.length ?
                                                    <div className="flex items-center justify-center"
                                                        onClick={
                                                            () => {
                                                                setSelectedProducts(new Map());
                                                            }
                                                        }>
                                                        <CircleCheckBig size={20} />
                                                    </div>
                                                    :
                                                    <div
                                                        className="flex items-center justify-center"
                                                        onClick={
                                                            () => {
                                                                setSelectedProducts(new Map(products.map(p => [p.id, p])));
                                                            }
                                                        }>
                                                        {/* <div
                                                            className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                                        </div> */}
                                                        <Circle size={20} color="gray" />
                                                    </div>

                                            }

                                            {selectedProducts && selectedProducts.size > 0 &&
                                                <>
                                                    <SwitchButton
                                                        selectedMarket={selectedMarket}
                                                        selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                    closeAfter={exitEditMode}
                                                        setFilteredVendors={setFilteredVendors}
                                                        setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                        theme={theme}
                                                    />
                                                    <SignalErrorButton
                                                    closeAfter={exitEditMode}
                                                        selectedMarket={selectedMarket}
                                                    selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                    setFilteredVendors={setFilteredVendors}
                                                    />
                                                    <DeleteButton
                                                        closeAfter={exitEditMode}
                                                        selectedMarket={selectedMarket}
                                                        selectedProducts={new Map().set(vendor.id, Array.from(selectedProducts.keys()))}
                                                        setFilteredVendors={setFilteredVendors}
                                                        theme={theme}
                                                    />
                                                </>}
                                        </div>
                                    } />
                                :
                                <TopBar
                                    leftComponent={<h2
                                        className="line-clamp-1 m-0 p-0 text-2xl font-bold">{vendor.name}</h2>}
                                    rightComponent={
                                        <Button variant="outlined" color="bw" onClick={openQrCodeDialog}>
                                            <div className="flex flex-row items-center gap-4">
                                                <span>Confirm Purchase</span>
                                                <ScanQrCode />
                                            </div>
                                        </Button>
                                    }>
                                </TopBar>
                            }
                        </div>
                        <Sheet.Scroller className="px-6 pb-14 mt-4 flex flex-col gap-4">
                            {/* Vendor's Categories */}
                            <div className="w-full">
                                <VendorCategoryList categories={vendor.categories} />
                            </div>

                            <VendorBadges market={vendor.market} quality={vendor.quality_rating}
                                cordiality={vendor.cordiality_rating}
                                convenience={vendor.convenience_rating} changeTab={changeTab} positionCallback={() => setVendorBadgePositionCallback && setVendorBadgePositionCallback(vendor)} />

                            <div className={`relative h-0 bottom-10 -right-2 text-right w-full flex justify-end ${showUpArrow ? "opacity-10 animate-pulse" : "opacity-0"} transition-opacity duration-1000`}>
                                <ArrowUpFromDot />
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
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                {
                    origin != "map" ?
                        <Sheet.Backdrop onTap={() => handleClose()} style={{ backgroundColor: "transparent" }} /> : <></>
                }
            </Sheet >
            <Dialog open={isQrCodeDialogOpen} onClose={() => { setIsQrCodeDialogOpen(false); setIsOpen(true) }} onClick={() => setIsQrCodeDialogOpen(false)}>
                {/* <DialogTitle>QR Code</DialogTitle> */}
                <DialogContent className={`flex flex-col items-center justify-between gap-4 font-medium text-xl text-center ${theme === "dark" ? "bg-dark-tremor-background text-white" : "bg-tremor-background text-black"}`} onClick={confirmSale}>
                    <QRCodeSVG bgColor={theme === "dark" ? "oklch(0.21 0.034 264.665)" : "white"} fgColor={theme === "dark" ? "white" : "black"} value={products.map(p => p.name).join(', ')} size={256} marginSize={4} level="Q" />
                    <p>Show this to the vendor to confirm the purchase!</p>
                </DialogContent>
            </Dialog>
        </>
    );
}