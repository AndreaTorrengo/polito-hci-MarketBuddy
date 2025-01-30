import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Market } from "../../models";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";
import { Vendor } from "../../models";

interface PageShoppingListProps {
  readonly theme: string;
  readonly productsList: { [key: string]: string[] };
  readonly setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  readonly selectedMarket: Market;
  readonly missingProducts: string[];
  readonly setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

export default function PageShoppingList({ missingProducts, theme, selectedMarket, productsList, setProductsList, setFilteredVendors }: PageShoppingListProps) {
  return (
    <>
      <div id="ShoppingListPage">

        <h1>Shopping List</h1>
      </div>

      <PageVendorProducts selectedMarket={selectedMarket} theme={theme} setFilteredVendors={setFilteredVendors} vendorId={0}></PageVendorProducts>

      <MissingProductsDialog
        theme={theme}
        productsList={productsList}
        setProductsList={setProductsList}
        selectedMarket={selectedMarket}
        setFilteredVendors={setFilteredVendors}
      />


    </>
  );
}
