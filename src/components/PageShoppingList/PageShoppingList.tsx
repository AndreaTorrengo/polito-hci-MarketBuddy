import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";

export default function PageShoppingList({ selectedMarket, setSelectedMarket }: {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
}) {

  console.log(selectedMarket);
  return (
    <>
      <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
      <h1>Shopping List</h1>
    </>
  );
}
