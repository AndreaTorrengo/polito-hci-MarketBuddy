import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Market } from "../../models";
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
}

export default function PageShoppingList({ missingProducts, theme, selectedMarket, productsList, setProductsList, updateVendorsAndProducts }: PageShoppingListProps) {
  return (
    <>
      <div id="ShoppingListPage">

        <h1>Shopping List</h1>
      </div>

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

      <MissingProductsDialog
        missingProducts={missingProducts}
        theme={theme}
        productsList={productsList}
        setProductsList={setProductsList}
        selectedMarket={selectedMarket}
        updateVendorsAndProducts={updateVendorsAndProducts}

      />

          <PageVendorProducts vendorId={0} isOpen={isVendorPageOpen} setIsOpen={(value: boolean) => setIsVendorPageOpen(value)} ></PageVendorProducts>

      </div>
    </>
  );
}
