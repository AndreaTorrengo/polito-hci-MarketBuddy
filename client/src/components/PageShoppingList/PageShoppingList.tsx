import { useEffect } from "react";
import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import API from "../../API";

export default function PageShoppingList() {
  useEffect(() => {
    const vendors = API.getVendorsByMarket("Crocetta");
    console.log(vendors);
  })
  return (
    <>
      <h3>Shopping List page ._.</h3>
      <MarketSelectorSheet/>
      <h1 className="pt-64">Hi 1</h1>
      <h1 className="pt-64">Hi 2</h1>
      <h1 className="pt-64">Hi 3</h1>
      <h1 className="pt-64">Hi 4</h1>
    </>
  );
}
