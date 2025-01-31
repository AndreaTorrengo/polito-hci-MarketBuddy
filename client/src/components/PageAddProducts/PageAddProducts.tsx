"use client";
import {useEffect, useState} from "react";
import { ButtonBase } from "@mui/material";
import { Button } from "../generalPurposeComponents/Button.tsx";
import {Product, Vendor} from "../../models.ts";
import ProductListItem, {ProductListItemProps} from "../PageVendorProducts/ProductListItem.tsx";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import API from "../../API.ts";
import {useNavigate, useParams} from "react-router-dom";
import ConfirmAddAlert from "../generalPurposeComponents/ConfirmAddAlert.tsx";

interface PageAddProductsParams {
    allVends: Vendor[];
    actualVends: Vendor[];
    theme: string;
}

export default function PageAddProducts({actualVends, allVends, theme}: PageAddProductsParams) {
    const {id} = useParams()

    const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);

    const actualVendorsProducts: Vendor[] = id != null ? actualVends.filter(vendor => vendor.id === Number(id)) : actualVends;
    const allVendors: Vendor[] = id != null ? allVends.filter(vendor => vendor.id === Number(id)) : allVends;

    const productsAlreadyAdded: Product[] = Array.from(new Set(actualVendorsProducts.flatMap(
        (vendor: Vendor) => vendor.products
    ).map(product => product.id)))
        .map(id => actualVendorsProducts.flatMap(vendor => vendor.products).find(product => product.id === id)!);

    const availableProducts: Product[] = Array.from(new Set(allVendors.flatMap(
        (vendor: Vendor) => vendor.products
    ).map(product => product.id)))
        .map(id => allVendors.flatMap(vendor => vendor.products).find(product => product.id === id)!);

    const [allProducts, setAllProducts] = useState<ProductListItemProps[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<Map<number, ProductListItemProps>>(new Map());

    const navigate = useNavigate();

    useEffect(
        () => {
            const fetchProducts = async () => {
                try {
                    const products: Product[] = await API.getAllProducts();
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
        }, []
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

    async function handleAdd() {
        if (!selectedProducts) {
            throw new Error("Selected products is null");
        }
        try {
            //await API.addProductsToShoppingList(Array.from(selectedProducts.values()));

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="h-full">
            {/* TopBar */}
            <ConfirmAddAlert theme={theme} setIsOpen={setIsAddAlertOpen} isOpen={isAddAlertOpen} numberOfProducts={selectedProducts.size}
                             handleAdd={handleAdd}></ConfirmAddAlert>
            <TopBar
                leftComponent={selectedProducts &&
                    <ButtonBase className="text-md font-semibold" onClick={() => {
                        navigate(-1)
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
                                                  d="M5 13l4 4L19 7"/>
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
                            <>
                            </>}

                        {selectedProducts && selectedProducts.size > 0 &&
                            <Button variant="outlined" onClick={() => {setIsAddAlertOpen(true)}}>
                                <div className="flex flex-row items-center justify-center">
                                    Add
                                </div>
                            </Button>
                        }

                    </div>
                }>
            </TopBar>

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
                                                             }/>
                                        </ButtonBase>
                                )))
                                :
                                <div className="flex flex-col h-80 items-center justify-center gap-4">
                                    {
                                        id != null ?
                                            <p className="m-0 p-0 text-xl text-center">No more products available
                                                for <br/> {
                                                    actualVendorsProducts ? (actualVendorsProducts.length >= 1 ? actualVendorsProducts[0].name : "this vendor") : ""
                                                }</p>
                                            :
                                            <p className="m-0 p-0 text-xl text-center">No more products available
                                                in <br/> {
                                                    actualVendorsProducts ? (actualVendorsProducts.length >= 1 ? actualVendorsProducts[0].market : "your market") : ""
                                                }</p>

                                    }
                                    <Button variant="contained" onClick={() => {
                                        navigate(-1)
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