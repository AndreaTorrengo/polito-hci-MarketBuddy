import TopBar from "../generalPurposeComponents/TopBar.tsx";
import VendorCategoryList from "./VendorCategoryList.tsx";
import React, { useState } from "react";
import AddProductButton from "./AddProductButton.tsx";
import ProductListItem, { ProductListItemProps } from "./ProductListItem.tsx";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Sheet } from 'react-modal-sheet';
import VendorBadges from "./VendorBadges.tsx";
import { ButtonBase, IconButton } from "@mui/material";
import ContextMenu, { ContextMenuProps } from "../generalPurposeComponents/ContextMenu.tsx";
import SwitchButton from "./SwitchButton.tsx";
import DeleteButton from "./DeleteButton.tsx";
import SignalErrorButton from "./SignalErrorButton.tsx";
import { Market, Vendor } from "../../models.ts";

interface PageVendorProductsParams {
    vendorId: number;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    theme: string
}

export default function PageVendorProducts({ vendorId, selectedMarket, setFilteredVendors, theme }: PageVendorProductsParams) {
    const approot = document.getElementById("approot")!;

    const handleSwitchClick = () => {
        console.log('SwitchButton clicked!');
        // Aggiungi qui la logica che vuoi eseguire al clic
    };

    const [isEditMode, setIsEditMode] = useState(false);
    const [categories] = useState<string[]>([
        "Category 1",
        "Category 2",
        "Category 3"
    ]);

    const [products] = useState<ProductListItemProps[]>([
        {
            id: 0,
            name: "Product 1",
            price: "2,00",
            image: "https://www.ortofruttafoglia.it/wp-content/uploads/2021/11/banana-chiquita.jpg"
        },
        {
            id: 1,
            name: "Product 2",
            price: "4,00",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToroQiAMxPnyX-gVi9xtNkh8liffQKdC_6ZQ&s"
        },
        {
            id: 2,
            name: "Product 3",
            price: "3,20",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx2txlL9JImnHCk1v30GWPjrgxHri5I0ig4g&s"
        },
        {
            id: 3,
            name: "Product 4",
            price: "5,10",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwGRr6MtCnhQa7yyn7X7NN_FEAAOwJDW2fQA&s"
        },
        {
            id: 4,
            name: "Product 5",
            price: "7,40",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sTbc5y-hV5F4iPZQ77-NXhfRXqphmjEpyw&s"
        },
        {
            id: 5,
            name: "Product 1",
            price: "2,00",
            image: "https://www.ortofruttafoglia.it/wp-content/uploads/2021/11/banana-chiquita.jpg"
        },
        {
            id: 6,
            name: "Product 2",
            price: "4,00",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToroQiAMxPnyX-gVi9xtNkh8liffQKdC_6ZQ&s"
        },
        {
            id: 7,
            name: "Product 3",
            price: "3,20",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx2txlL9JImnHCk1v30GWPjrgxHri5I0ig4g&s"
        },
        {
            id: 8,
            name: "Product 4",
            price: "5,10",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwGRr6MtCnhQa7yyn7X7NN_FEAAOwJDW2fQA&s"
        },
        {
            id: 9,
            name: "Product 5",
            price: "7,40",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sTbc5y-hV5F4iPZQ77-NXhfRXqphmjEpyw&s"
        }
    ]);

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps> | null>(null);

    const [isOpen, setIsOpen] = useState(false);
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

    const onLongPress = (event: React.MouseEvent, productId: number) => {
        event.preventDefault();
        setContextMenuProps({ ...contextMenuProps, isOpen: true, x: event.clientX, y: event.clientY });
    };

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

    function addOrRemoveSelected(index: number) {
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
        <>
            <div className="font-bold py-2 px-4 inline-flex items-center dark:text-dark-tremor-content-strong animated dark:active:text-dark-tremor-content-emphasis active:scale-subtle" onClick={() => setIsOpen(true)}>
                <span className="ml-2">Example Vendor</span>
            </div>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' rootId="root" mountPoint={approot}>
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
                                        leftComponent={<ButtonBase className="text-md font-semibold" onClick={exitEditMode}><p className="m-0 p-0">Cancel</p></ButtonBase>}
                                        centerComponent={<h1
                                            className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (selectedProducts.size + " Selected") : ""}</h1>}
                                        rightComponent={
                                            <>
                                                {
                                                    selectedProducts && selectedProducts.size === products.length ?
                                                        <div className="w-8 h-16 flex items-center justify-center" onClick={
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
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300" onClick={
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
                                                        <SwitchButton selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme} />
                                                        <SignalErrorButton selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme} />
                                                        <DeleteButton  selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme}/>
                                                    </>}

                                            </>
                                        }>
                                    </TopBar>
                                    :
                                    <TopBar
                                        centerComponent={<h1
                                            className="line-clamp-1 m-0 p-0 text-2xl titleFont font-bold">Name
                                            of
                                            the vendor check
                                            if the name
                                            is too much long</h1>}
                                        rightComponent={
                                            <div className="flex flex-row">
                                                <IconButton>
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
                                        <VendorCategoryList categories={categories} />
                                    </div>

                                    <div className="w-full">
                                        <VendorBadges market="Crocetta Market" quality={79} cordiality={80} convenience={70.3} />
                                    </div>

                                    <div className="w-full flex-1">
                                        {/* Product list top bar */}
                                        <div className="w-full flex flex-row justify-between items-center">
                                            <p className="m-0 p-0">Your planned purchases</p>
                                            <AddProductButton />
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
                                                        <ProductListItem key={index} {...product} editMode={true} isSelected={
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
                <Sheet.Backdrop onTap={() => setIsOpen(false)} />
            </Sheet>
        </>
    );
}