import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Vendor, Market } from "../../models";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";
import {useState} from "react";
import VendorGroup from "./VendorGroup";

interface PageShoppingListProps {
    filteredVendors: Vendor[];
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setMissingProducts: React.Dispatch<React.SetStateAction<string[]>>;
    missingProducts: string[];
    theme: string;
    sortByQuality: boolean;
    sortByConvenience: boolean;
    sortByCordiality: boolean;
    selectedMarket: Market;
    setSelectedMarket: (market: Market) => void;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
}

export default function PageShoppingList({ filteredVendors, setFilteredVendors, setMissingProducts, missingProducts, theme, sortByQuality, sortByConvenience, sortByCordiality,selectedMarket, setSelectedMarket,productsList, setProductsList }: PageShoppingListProps) {
    const [isVendorPageOpen, setIsVendorPageOpen] = useState(false);

  return (
    <>
      <div id="ShoppingListPage" className="flex flex-col gap-2">
        <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />

          <MissingProductsDialog
              filteredVendors={filteredVendors}
              setFilteredVendors={setFilteredVendors}
              setMissingProducts={setMissingProducts}
              missingProducts={missingProducts}
              theme={theme}
              sortByQuality={sortByQuality}
              sortByConvenience={sortByConvenience}
              sortByCordiality={sortByCordiality}
              productsList={productsList}
              setProductsList={setProductsList}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
          />

          <VendorGroup name="Vendor 1" products={[
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
          ]} id={0} categories={
              ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"]
          } />

          <PageVendorProducts vendorId={0} isOpen={isVendorPageOpen} setIsOpen={(value: boolean) => setIsVendorPageOpen(value)} ></PageVendorProducts>

      </div>
    </>

  );
}
