import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";

export default function PageShoppingList({ selectedMarket, selectMarket }: Readonly<{
  selectedMarket: string;
  selectMarket: (market: string) => void;
}>) {

  return (
    <div id="ShoppingListPage">
      <MarketSelectorSheet selectedMarket={selectedMarket} selectMarket={selectMarket} />
      <h1>Shopping List</h1>
    </div>
  );
}
