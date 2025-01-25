import MissingProductsDialog from "../MissingProductsDialog/MissingProductsDialog";
import { Vendor, Market } from "../../models";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";

interface PageShoppingListProps {
  theme: string;
  productsList: { [key: string]: string[] };
  setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  selectedMarket: Market;
  missingProducts: string[];
  updateVendorsAndProducts: () => void;
}

export default function PageShoppingList({ missingProducts, theme, selectedMarket, productsList, setProductsList, updateVendorsAndProducts }: PageShoppingListProps) {
  return (
    <>
      <div id="ShoppingListPage">

        <h1>Shopping List</h1>
      </div>

      <PageVendorProducts vendorId={0}></PageVendorProducts>

      <MissingProductsDialog
        missingProducts={missingProducts}
        theme={theme}
        productsList={productsList}
        setProductsList={setProductsList}
        selectedMarket={selectedMarket}
        updateVendorsAndProducts={updateVendorsAndProducts}

      />


    </>
  );
}
