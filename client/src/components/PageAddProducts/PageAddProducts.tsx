"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonBase } from "@mui/material";
import { Button } from "../generalPurposeComponents/Button.tsx";
import { Market, Product, Vendor } from "../../models.ts";
import ProductListItem, { ProductListItemProps } from "../PageVendorProducts/ProductListItem.tsx";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import API from "../../API.ts";
import ConfirmAddAlert from "../generalPurposeComponents/ConfirmAddAlert.tsx";
import globalContext from "../../Context.tsx";

interface PageAddProductsParams {
    allVends: Vendor[];
    actualVends: Vendor[];
    theme: string;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setAddProductId: React.Dispatch<React.SetStateAction<number | null>>;
    addProductId: number | null;
    isFeedbackDialogOpen: string | null;
    setIsFeedbackDialogOpen: (value: string | null) => void;
}

export default function PageAddProducts({ actualVends, allVends, theme, selectedMarket, setFilteredVendors, addProductId, setAddProductId, isFeedbackDialogOpen, setIsFeedbackDialogOpen }: PageAddProductsParams) {
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '[]');

    const actualVendorsProducts: Vendor[] = useMemo(() => addProductId != -1 ? actualVends.filter(vendor => vendor.id === addProductId) : actualVends, [addProductId, actualVends]);
    const allVendors: Vendor[] = useMemo(() => addProductId != -1 ? allVends.filter(vendor => vendor.id === addProductId) : allVends, [addProductId, allVends]);

    const productsAlreadyAdded: Product[] = useMemo(() => Array.from(new Set(actualVendorsProducts.flatMap(
        (vendor: Vendor) => vendor.products
    ).map(product => product.id)))
        .map(id => actualVendorsProducts.flatMap(vendor => vendor.products).find(product => product.id === id)!), [actualVendorsProducts]);

    const availableProducts: Product[] = useMemo(() => Array.from(new Set(allVendors.flatMap(
        (vendor: Vendor) => vendor.products
    ).map(product => product.id)))
        .map(id => allVendors.flatMap(vendor => vendor.products).find(product => product.id === id)!), [allVendors]);

    const [allProducts, setAllProducts] = useState<ProductListItemProps[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps>>(new Map());

    const askConfirmation = useContext(globalContext)?.askConfirmation;
    const showToastMessage = useContext(globalContext)?.showToastMessage;

    useEffect(
        () => {
            const fetchProducts = async () => {
                try {
                    const products: Product[] = await API.getAllProducts();
                    console.log(products)
                    setAllProducts(products.map(product => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        isSelected: false,
                        editMode: true,
                        showPrice: false
                    }))
                        .filter(product => !productsAlreadyAdded.some(item => item.id === product.id))
                        .filter(product => availableProducts.some(item => item.id === product.id))
                    );
                } catch (error) {
                    console.error(error);
                }
            }
            fetchProducts();
        }, [availableProducts, productsAlreadyAdded]
    )

    function addOrRemoveSelected(index: number) {
        if (!selectedProducts) {
            throw new Error("Selected products is null");
        }
        const product = allProducts[index];
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

    function handleAdd() {
        selectedProducts.forEach((product, productId) => {
            let productAdded = false;
            allVends.forEach(vendor => {
                if (productAdded) return;
                const product = vendor.products.find(product => product.id === productId);
                if (product) {
                    const existingVendor = filteredVendors.find(v => v.id === vendor.id);
                    if (existingVendor) {
                        existingVendor.products.push(product);
                    } else {
                        const newVendor = { ...vendor, products: [product] };
                        filteredVendors.push(newVendor);
                    }
                    productAdded = true;
                }
            });
        });


        setFilteredVendors(filteredVendors);
        localStorage.setItem(filteredVendorsKey, JSON.stringify(filteredVendors));
        setAddProductId(null);

        showToastMessage && showToastMessage("Selected products have been succesfully added to your shopping list", "success");
    }

    function confirmAddAlert() {
        askConfirmation && askConfirmation(
            handleAdd,
            <>
                <span className="text-lg">The following products will be added to your shopping list:</span>
                <span className="font-medium text-lg">{Array.from(selectedProducts.values()).map(product => product.name).join(', ')}</span>
            </>,
            'Cancel',
            'Confirm'
        );
    }

    return (
        <div className="w-full h-full">
            {/* TopBar */}
            {/* <ConfirmAddAlert theme={theme} setIsOpen={setIsAddAlertOpen} isOpen={isAddAlertOpen} products={selectedProducts} handleAdd={handleAdd} /> */}
            <div className="px-8">
                <TopBar
                    leftComponent={selectedProducts &&
                        <ButtonBase className="text-md font-semibold" onClick={() => {
                            setAddProductId(null);
                        }}><p
                            className="m-0 p-0">Cancel</p></ButtonBase>}
                    centerComponent={allProducts && allProducts.length > 0 && <h1
                        className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (selectedProducts.size + " Selected") : ""}</h1>}
                    rightComponent={allProducts && allProducts.length > 0 &&
                        <div className="flex flex-row gap-2 items-center">
                            {
                                selectedProducts && selectedProducts.size === allProducts.length ?
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
                                    <div
                                        className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300"
                                        onClick={
                                            () => {
                                                setSelectedProducts(new Map(allProducts.map(p => [p.id, p])));
                                            }
                                        }>
                                        <div
                                            className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                        </div>
                                    </div>

                            }

                            {selectedProducts && selectedProducts.size > 0 &&
                                <Button variant="outlined" onClick={confirmAddAlert}>
                                    Add
                                </Button>
                            }

                        </div>
                    }>
                </TopBar>
            </div>

            <div
                className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle px-6 pt-[3.45em] flex flex-col gap-4">

                <div className="w-full flex-1">
                    {/* Product list top bar */}
                    {
                        allProducts && allProducts.length > 0 &&
                        <div className="w-full flex flex-row justify-between items-center">
                            <p className="m-0 p-0">Choose product/s</p>
                        </div>
                    }
                    {/* Product list */}
                    <div className="w-full flex flex-col gap-3 mt-4 pb-[4rem]">
                        {
                            allProducts && allProducts.length > 0 ?
                                (allProducts.map((product, index) => (
                                    !availableProducts.some(item => item.id === product.id) ?
                                        /*<ButtonBase key={product.id} component="div"
                                                    onClick={() => {
                                                        addOrRemoveSelected(index);
                                                    }}
                                        >
                                            <NotAvailableItem key={index} {...product} editMode={true} showPrice={false} isSelected={
                                                selectedProducts ? selectedProducts.has(product.id) : false
                                            }/>
                                        </ButtonBase>*/
                                        null
                                        :
                                        <ButtonBase key={product.id} component="div"
                                            onClick={() => {
                                                addOrRemoveSelected(index);
                                            }}
                                        >
                                            <ProductListItem key={index} {...product} showPrice={false} editMode={true}
                                                isSelected={
                                                    selectedProducts ? selectedProducts.has(product.id) : false
                                                } />
                                        </ButtonBase>
                                )))
                                :
                                <div className="flex flex-col h-80 items-center justify-center gap-4">
                                    {
                                        addProductId != -1 ?
                                            <p className="m-0 p-0 text-xl text-center">No more products available
                                                for <br /> {
                                                    actualVendorsProducts ? (actualVendorsProducts.length >= 1 ? actualVendorsProducts[0].name : "this vendor") : ""
                                                }</p>
                                            :
                                            <p className="m-0 p-0 text-xl text-center">No more products available
                                                in <br /> {
                                                    actualVendorsProducts ? (actualVendorsProducts.length >= 1 ? actualVendorsProducts[0].market : "your market") : ""
                                                }</p>

                                    }
                                    <Button variant="contained" onClick={() => {
                                        setAddProductId(null);
                                    }}>
                                        Go Back
                                    </Button>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}