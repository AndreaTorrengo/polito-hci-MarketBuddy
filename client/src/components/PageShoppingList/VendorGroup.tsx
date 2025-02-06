import ProductItem, { ProductItemProps } from "./ProductItem.tsx";
import { Award, Smile, ChevronRight, CircleCheckBig, Circle, CircleDollarSign } from "lucide-react";
import { ButtonBase } from "@mui/material";
import { Vendor } from "../../models.tsx";
import React, { useContext, useRef } from "react";
import VendorCategoryList from "../PageVendorProducts/VendorCategoryList.tsx";
import globalContext, { AppContextProps } from "../../Context.tsx";

export interface VendorGroupProps {
    id: number;
    vendor: Vendor;
    products: ProductItemProps[];
    setVendorPageOpened: (value: boolean) => void;
    setSelectedVendor: () => void;
    openEditMode: (vendorId: number, productId: number) => void;
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
}: Readonly<VendorGroupProps>) {
    const { theme } = useContext<AppContextProps>(globalContext);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = (vendorId: number, productId: number) => {
        if (!isEditMode) {
            intervalRef.current = setInterval(() => {
                openEditMode(vendorId, productId)
            }, 700);
        }
    }
    const handleTouchStop = () => {

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = null;
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        const touch = event.touches[0];
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        if (
            touch.clientX < rect.left ||
            touch.clientX > rect.right ||
            touch.clientY < rect.top ||
            touch.clientY > rect.bottom
        ) {
            handleTouchStop();
        }
    };

    return (
        <>
            <div className="flex flex-row gap-2 pb-2 mt-3 items-center justify-between cursor-pointer" onClick={() => {
                setSelectedVendor();
                setVendorPageOpened(true)
            }} onContextMenu={(e) => {
                e.preventDefault()
            }}
                onTouchEnd={handleTouchStop}
                onTouchStart={() => handleTouchStart(vendor.id, -1)}
            >
                <div className="flex flex-row items-center gap-2 select-none">
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

                <div className="flex w-1/2 justify-evenly items-center">
                    {/* <div className="flex flex-col w-full gap-6"> */}
                    <div className="w-1/3 flex pe-1 flex-row items-center justify-end">
                        <Award color={`var(--${theme === 'dark' ? 'dark-' : ''}quality)`} />
                        <p className="m-0 p-0 font-semibold text-left">{vendor.quality_rating}</p>
                    </div>
                    <div className="w-1/3 flex pe-1 flex-row items-center justify-end">
                        <Smile color={`var(--${theme === 'dark' ? 'dark-' : ''}cordiality)`} size={22} />
                        <p className="m-0 p-0 font-semibold text-left">{vendor.cordiality_rating}</p>
                    </div>
                    <div className="w-1/3 flex pe-1 flex-row items-center justify-end">
                        <CircleDollarSign color={`var(--${theme === 'dark' ? 'dark-' : ''}convenience)`} size={22} />
                        <p className="m-0 p-0 font-semibold text-left">{vendor.convenience_rating}</p>
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="w-full pb-2">
                <VendorCategoryList categories={vendor.categories} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((product) => (
                    <ButtonBase key={product.id} component="div"
                        onContextMenu={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => {
                            addOrRemoveSelected(vendor.id, product.id);
                        }}
                        onTouchEnd={handleTouchStop}
                        onTouchStart={() => handleTouchStart(vendor.id, product.id)}
                        onTouchMove={handleTouchMove}
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