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
}

export default function PageShoppingList({
                                             missingProducts,
                                             theme,
                                             selectedMarket,
                                             productsList,
                                             setProductsList,
                                             updateVendorsAndProducts,
                                             vendors
                                         }: PageShoppingListProps) {
    const [isVendorPageOpen, setIsVendorPageOpen] = useState(false);

    return (
        <>
            <div id="ShoppingListPage" className="flex flex-col gap-2">


                <MissingProductsDialog
                    missingProducts={missingProducts}
                    theme={theme}
                    productsList={productsList}
                    setProductsList={setProductsList}
                    selectedMarket={selectedMarket}
                    updateVendorsAndProducts={updateVendorsAndProducts}

                />

                <PageVendorProducts vendorId={0} isOpen={isVendorPageOpen}
                                    setIsOpen={(value: boolean) => setIsVendorPageOpen(value)} theme={theme}></PageVendorProducts>

                {
                    vendors.map((vendor) => (
                        <VendorGroup key={vendor.id} id={vendor.id} setVendorPageOpened={(value: boolean) => setIsVendorPageOpen(value)}
                                     categories={vendor.categories} name={vendor.name}
                                     products={vendor.products.map(
                                            (product) => ({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                    image: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
                                            }
                                     ))}/>
                    ))
                }

            </div>
        </>
    );
}
