import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Vendor } from "../../models";

interface PageShoppingListProps {
  filteredVendors: Vendor[];
  setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setMissingProducts: React.Dispatch<React.SetStateAction<string[]>>;
  missingProducts: string[];
  theme: string;
  sortByQuality: boolean;
  sortByConvenience: boolean;
  sortByCordiality: boolean;
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
}

export default function PageShoppingList({ filteredVendors, setFilteredVendors, setMissingProducts, missingProducts, theme, sortByQuality, sortByConvenience, sortByCordiality,selectedMarket, setSelectedMarket }: PageShoppingListProps) {
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
      />


    </>

  );
}
