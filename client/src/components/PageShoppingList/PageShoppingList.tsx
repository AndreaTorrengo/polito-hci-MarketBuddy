import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Market, Vendor, Product } from "../../models";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";
import { useState } from "react";
import VendorGroup from "./VendorGroup";
import { UserData } from "../PageProfile/UserData";
interface PageShoppingListProps {
    readonly theme: string;
    readonly productsList: { [key: string]: string[] };
    readonly setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    readonly selectedMarket: Market;
    readonly openEditMode: (event: React.MouseEvent, vendorId: number, productId: number) => void;
    readonly addOrRemoveSelected: (vendorId: number, productId: number) => void;
    readonly isEditMode: boolean;
    readonly selectedProducts?: Map<number, number[]> | null;
    readonly selectedOrRemoveAllProductsFromVendor: (vendorId: number, remove: boolean) => void;
    readonly filteredProductsVendors: Vendor[];
    readonly setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    readonly filteredVendors: Vendor[];
    setAddProductId: React.Dispatch<React.SetStateAction<number | null>>;
    selectedReasons: string[];
    setSelectedReasons: React.Dispatch<React.SetStateAction<string[]>>;
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
    productsWithoutAlternatives: Product[];
    closeAfter: () => void;
    userdata: UserData;
    setUserdata: React.Dispatch<React.SetStateAction<UserData>>;
}

export default function PageShoppingList({
    theme,
    selectedMarket,
    productsList,
    setProductsList,
    openEditMode,
    addOrRemoveSelected,
    isEditMode,
    selectedProducts,
    selectedOrRemoveAllProductsFromVendor,
    filteredProductsVendors,
    setFilteredVendors,
    setAddProductId,
    selectedReasons,
    setSelectedReasons,
    productsWithoutAlternatives,
    closeAfter,
    filteredVendors,
    setProductsWithoutAlternatives,
    userdata,
    setUserdata,
}: Readonly<PageShoppingListProps>) {
    const [isVendorPageOpen, setIsVendorPageOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<number>(-1);


    return (
        <div id="ShoppingListPage" className="flex flex-col gap-2">
            {!isEditMode &&
                <MissingProductsDialog
                    theme={theme}
                    productsList={productsList}
                    setProductsList={setProductsList}
                    selectedMarket={selectedMarket}
                    setFilteredVendors={setFilteredVendors}
                />
            }
            {
                filteredProductsVendors.map((vendor) => (
                    vendor.products.length > 0 &&
                    <div key={vendor.id}>
                        {selectedVendor === vendor.id &&
                            <PageVendorProducts
                                productsWithoutAlternatives={productsWithoutAlternatives} setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                selectedReasons={selectedReasons} setSelectedReasons={setSelectedReasons}
                                vendor={vendor} isOpen={isVendorPageOpen}
                                closeAfter={closeAfter}
                                setIsOpen={(value: boolean) => setIsVendorPageOpen(value)}
                                    theme={theme} setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket} setAddProductId={setAddProductId} productsList={productsList} setProductsList={setProductsList} filteredVendors={filteredVendors} 
                                    userdata={userdata} setUserdata={setUserdata}/>}

                            <VendorGroup id={vendor.id}
                                openEditMode={openEditMode}
                                addOrRemoveSelected={addOrRemoveSelected}
                                vendor={vendor}
                                setVendorPageOpened={(value: boolean) => {
                                    if (!isEditMode) {
                                        setIsVendorPageOpen(value)
                                    }
                                }}
                                setSelectedVendor={() => {
                                    if (!isEditMode) {
                                        setSelectedVendor(vendor.id)
                                    }
                                }}
                                products={vendor.products.map(
                                    (product) => ({
                                        id: product.id,
                                        name: product.name,
                                        price: parseFloat((product.price * vendor.priceMultiplier).toFixed(2)),
                                        points: product.points,
                                        image: product.image,
                                        showPrice: true,
                                    }
                                    ))}
                                selectedProducts={selectedProducts ? selectedProducts.get(vendor.id) || [] : []}
                                isEditMode={isEditMode}
                                selectedOrRemoveAllProductsFromVendor={selectedOrRemoveAllProductsFromVendor}
                            />
                    </div>
                )
                )}
        </div>
    );
}
