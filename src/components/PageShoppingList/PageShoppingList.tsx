import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";

export default function PageShoppingList({ selectedMarket, setSelectedMarket }: {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
}) {

  return (
    <div className="dark:bg-dark-tremor-background dark:text-dark-tremor-content-emphasis">
      <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
      <h1>Shopping List</h1>
    </div>
  );
}
