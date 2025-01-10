import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Vendor, Market } from "../../models";

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
  return (
    <>
      <div id="ShoppingListPage">
        <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
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


    </>

  );
}
