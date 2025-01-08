import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts";

export default function PageShoppingList({ selectedMarket, setSelectedMarket }: {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
}) {
  return (
    <div id="ShoppingListPage">
      <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
      <PageVendorProducts vendorId={2}></PageVendorProducts>
      <h1>Shopping List</h1>
    </div>
  );
}
