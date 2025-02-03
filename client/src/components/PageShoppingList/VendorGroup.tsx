import ProductItem, {ProductItemProps} from "./ProductItem";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import {ButtonBase} from "@mui/material";
import {Vendor} from "../../models";
import React from "react";
import VendorCategoryList from "../PageVendorProducts/VendorCategoryList";

export interface VendorGroupProps {
    id: number;
    vendor: Vendor;
    products: ProductItemProps[];
    setVendorPageOpened: (value: boolean) => void;
    setSelectedVendor: () => void;
    openEditMode: (event: React.MouseEvent, vendorId: number, productId: number) => void;
    addOrRemoveSelected: (vendorId: number, productId: number) => void;
    selectedProducts: number[];
    isEditMode: boolean;
    selectedOrRemoveAllProductsFromVendor: (vendorId: number, remove: boolean) => void;
}

export default function VendorGroup({
                                        products,
                                        vendor,
                                        setVendorPageOpened,
                                        setSelectedVendor,
                                        openEditMode,
                                        addOrRemoveSelected,
                                        selectedProducts,
                                        isEditMode,
                                        selectedOrRemoveAllProductsFromVendor
                                    }: VendorGroupProps) {
    return (
        <>
            <div className="flex flex-row gap-2 pb-2 mt-3 items-center justify-between cursor-pointer" onClick={() => {
                setSelectedVendor();
                setVendorPageOpened(true)
            }}>
                <div className="max-w-[50%] min-w-[30%] flex flex-row items-center gap-2">
                {/* Show Select Indicator in Edit Mode */}
                {
                    isEditMode &&
                    (
                        selectedProducts && selectedProducts.length === products.length ?
                            <div onClick={
                                () => {
                                    selectedOrRemoveAllProductsFromVendor(vendor.id, true);
                                }
                            }>
                                <div
                                        className="rounded-full text-green-500 h-5 w-5 border-2 border-gray-300 transition-all duration-300">
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
                                className="animate-fade transition-all duration-300"
                                onClick={
                                    () => {
                                        selectedOrRemoveAllProductsFromVendor(vendor.id, false);
                                    }
                                }>
                                <div
                                        className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-gray-300 transition-all duration-300">
                                </div>
                            </div>
                    )
                }
                    <div className="flex flex-row items-center gap-2">
                        <span className="m-0 p-0 font-medium text-xl line-clamp-1">{vendor.name}</span>
                        <svg className="mt-0.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                </div>

                <div className="overflow-x-auto min-w-[50%]">
                    {/* <div className="flex flex-col w-full gap-6"> */}
                    <div className='flex flex-row items-center justify-around gap-2'>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <WorkspacePremiumIcon sx={{color: "#4b72a6"}}/>
                            <p className="m-0 p-0 ms-0.5 font-bold">{vendor.quality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <SentimentSatisfiedAltIcon sx={{color: "#e3c144"}}/>
                            <p className="m-0 p-0 ms-0.5 font-bold">{vendor.cordiality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <SavingsIcon sx={{color: "#52a36a"}}/>
                            <p className="m-0 p-0 ms-0.5 font-bold">{vendor.convenience_rating}</p>
                            </div>
                        </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="w-full pb-2 overflow-x-auto">
                <VendorCategoryList categories={vendor.categories} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((product) => (
                    <ButtonBase key={product.id} component="div"
                                onContextMenu={(e) => {
                                    openEditMode(e, vendor.id, product.id);
                                }}
                                onClick={() => {
                                    addOrRemoveSelected(vendor.id, product.id);
                                }}
                    >
                        <ProductItem key={product.id} {...product}
                                     isSelected={selectedProducts.includes(product.id) || false}
                                     isEditMode={isEditMode}
                        />
                    </ButtonBase>
                ))}
            </div>
        </>
    );
}