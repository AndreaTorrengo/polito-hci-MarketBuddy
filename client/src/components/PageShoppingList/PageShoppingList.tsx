import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Vendor } from "../../models";

interface PageShoppingListProps {
  filteredVendors: Vendor[];
  setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setMissingProducts: React.Dispatch<React.SetStateAction<string[]>>;
  missingProducts: string[];
  theme: string;
}

export default function PageShoppingList({ filteredVendors, setFilteredVendors, setMissingProducts, missingProducts, theme }: PageShoppingListProps) {
  return (
    <>
      <h3>Shopping List page ._.</h3>
      <MarketSelectorSheet />

      <MissingProductsDialog
        filteredVendors={filteredVendors}
        setFilteredVendors={setFilteredVendors}
        setMissingProducts={setMissingProducts}
        missingProducts={missingProducts}
        theme={theme}
      />

      <h1 className="pt-64">Hi 1</h1>
      <h1 className="pt-64">Hi 2</h1>
      <h1 className="pt-64">Hi 3</h1>
      <h1 className="pt-64">Hi 4</h1>
    </>
  );
}
