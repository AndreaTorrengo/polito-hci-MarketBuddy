import ProductItem, {ProductItemProps} from "./ProductItem";
import { PiggyBank, Award, Smile, ChevronRight, CircleCheckBig, Circle } from "lucide-react";
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
            }} onContextMenu={(e) => {
                openEditMode(e, vendor.id, -1);
            }}>
                <div className="max-w-[50%] min-w-[30%] flex flex-row items-center gap-2 select-none">
                {/* Show Select Indicator in Edit Mode */}
                {
                    isEditMode &&
                    (
                        selectedProducts && selectedProducts.length === products.length ?
                                <div className="flex items-center" onClick={
                                () => {
                                    selectedOrRemoveAllProductsFromVendor(vendor.id, true);
                                }
                            }>
                                    <CircleCheckBig size={20} />
                            </div>
                            :
                            <div
                                    className="flex items-center"
                                onClick={
                                    () => {
                                        selectedOrRemoveAllProductsFromVendor(vendor.id, false);
                                    }
                                }>
                                    <Circle size={20} color="gray" />
                            </div>
                    )
                }
                    <div className="flex flex-row items-center gap-0.5">
                        <span className="m-0 p-0 font-medium text-xl line-clamp-1">{vendor.name}</span>
                        <ChevronRight className="pt-0.5" />
                    </div>
                </div>

                <div className="overflow-x-auto min-w-[50%]">
                    {/* <div className="flex flex-col w-full gap-6"> */}
                    <div className='flex flex-row items-center justify-around gap-2'>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                            <Award color="var(--quality)" />
                            <p className="m-0 p-0 ms-0.5 font-bold">{vendor.quality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                            <Smile color="var(--cordiality)" />
                            <p className="m-0 p-0 ms-0.5 font-bold">{vendor.cordiality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                            <PiggyBank color="var(--convenience)" />
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