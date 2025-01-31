import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import {Market, Vendor} from "../../models";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";
import {useState} from "react";
import VendorGroup from "./VendorGroup";

interface PageShoppingListProps {
    readonly theme: string;
    readonly productsList: { [key: string]: string[] };
    readonly setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    readonly selectedMarket: Market;
    readonly missingProducts: string[];
    readonly updateVendorsAndProducts: () => void;
    readonly vendors: Vendor[];
    readonly openEditMode: (event: React.MouseEvent, vendorId: number, productId: number) => void;
    readonly addOrRemoveSelected: (vendorId: number, productId: number) => void;
    readonly isEditMode: boolean;
    readonly selectedProducts?: Map<number, number[]> | null;
    readonly selectedOrRemoveAllProductsFromVendor: (vendorId: number, remove: boolean) => void;
    readonly filteredProductsVendors: Vendor[];
  readonly setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

export default function PageShoppingList({
                                             missingProducts,
                                             theme,
                                             selectedMarket,
                                             productsList,
                                             setProductsList,
                                             updateVendorsAndProducts,
                                             vendors,
                                             openEditMode,
                                             addOrRemoveSelected,
                                             isEditMode,
                                             selectedProducts,
                                             selectedOrRemoveAllProductsFromVendor,
                                             filteredProductsVendors,
                                             setFilteredVendors
                                         }: PageShoppingListProps) {
    const [isVendorPageOpen, setIsVendorPageOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<number>(-1);

    return (
        <>
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
                {isEditMode && <div className="h-[3rem]"/>}

                {
                    filteredProductsVendors.map((vendor) => (
                        <div key={vendor.id}>
                            {selectedVendor === vendor.id &&
                                <PageVendorProducts vendor={vendor} isOpen={isVendorPageOpen}
                                                    setIsOpen={(value: boolean) => setIsVendorPageOpen(value)}
                                                    theme={theme} setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket}></PageVendorProducts>}

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
                                                     price: product.price * vendor.priceMultiplier,
                                                     points: product.points,
                                                     image: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
                                                     showPrice: true,
                                                 }
                                             ))}
                                         selectedProducts={selectedProducts ? selectedProducts.get(vendor.id) || [] : []}
                                         isEditMode={isEditMode}
                                         selectedOrRemoveAllProductsFromVendor={selectedOrRemoveAllProductsFromVendor}
                            />
                            <div className={"h-[1rem]"}/>
                        </div>
                    ))
                }

            </div>
        </>
    );
}
