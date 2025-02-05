"use client";
import { List, ListItem, TextInput } from "@tremor/react";
import { Sheet } from "react-modal-sheet";
import { useEffect, useState } from "react";
import { Search, ChevronDown, MapPin, Store, Navigation } from 'lucide-react'
import { Market } from "../../models";
import TorinoMarkets from "../../markets.json";
import { Button } from "../generalPurposeComponents/Button";



function modifyMarketDistances(markets: Market[], selectedMarket: Market) {
  return markets.map(market => {
    if (market.id === selectedMarket.id) {
      market.distance = 0.5; // Set distance to 0.5 for the selected market
    } else {
      const randomChange = Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
      market.distance = Math.max(1.1, market.distance + randomChange); // Ensure distance is greater than 1
      market.distance = Math.min(10, market.distance); // Ensure distance does not exceed 10 km
      market.distance = Math.round(market.distance * 10) / 10; // Round to one decimal place
    }
    return market;
  });
}

export default function MarketSelectorSheet({ selectedMarket, setSelectedMarket, className }: Readonly<{
  selectedMarket: Market;
  setSelectedMarket: (market: Market) => void;
  className?: string;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [markets, setMarkets] = useState(TorinoMarkets);

  const approot = document.getElementById("approot")!;

  useEffect(() => {
    const modifiedMarkets = modifyMarketDistances(TorinoMarkets, selectedMarket);
    // Sort the markets so that the selected market is always at the top
    // The rest is by distance
    modifiedMarkets.sort((a, b) => {
      if (a.name === selectedMarket.name) return -1;
      if (b.name === selectedMarket.name) return 1;
      return a.distance - b.distance;
    });
    setMarkets(modifiedMarkets);
  }, [selectedMarket]);


  return (
    <>
      <Button variant="text" color="bw" className={`flex items-center align-middle font-bold ms-auto ${className}`} onClick={() => setIsOpen(true)}>
        <MapPin />
        <span className="">{selectedMarket.name}</span>
        <ChevronDown />
      </Button>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' mountPoint={approot} >
        <Sheet.Container>
          <Sheet.Header className="dark:bg-dark-tremor-background" />
          <Sheet.Content className="dark:bg-dark-tremor-background">
            <h1 className="font-bold text-3xl text-center">Choose The Market</h1>
            <div className="mx-20 mt-2 mb-4">
              <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
            </div>
            <Sheet.Scroller>
              <MarketsList selectMarket={(m) => { setSelectedMarket(m); setIsOpen(false); }} searchInput={searchInput} selectedMarket={selectedMarket} markets={markets} />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setIsOpen(false)} />
      </Sheet >
    </>
  );
}

function SearchBar({ searchInput, setSearchInput }: Readonly<{ searchInput: string, setSearchInput: (searchInput: string) => void }>) {
  return <TextInput
    placeholder="Search Markets"
    id="search"
    name="search"
    type="search"
    className="py-1 ps-4 rounded-full"
    icon={Search}
    onChange={(e) => setSearchInput(e.target.value)}
    value={searchInput}
  />;
}

function MarketsList({ selectMarket, searchInput, selectedMarket, markets }: Readonly<{ selectMarket: (market: Market) => void, searchInput: string, selectedMarket: Market, markets: Market[] }>) {
  return (
    <List className="w-auto mx-4 my-2 py-2">
      {markets.map((market) => (
        (searchInput === "" || market.name.toLowerCase().includes(searchInput.toLowerCase())) &&
        <ListItem key={market.id} className="flex items-center m-auto">
            <MarketCard market={market} selectedMarket={selectedMarket} selectMarket={selectMarket} />
        </ListItem>
      ))}
    </List>
  );
}



interface MarketCardProps {
  market: Market;
  selectedMarket: Market;
  selectMarket: (market: Market) => void;
}

function MarketCard({ market, selectedMarket, selectMarket }: Readonly<MarketCardProps>) {
  return (
    <Button className="flex justify-start w-full" onClick={() => selectMarket(market)}>
      <div className="flex flex-row items-center w-full">
        <div className="flex flex-col">
          {(market.name === selectedMarket.name) ? <Navigation className="me-3" size={32} /> :
            <Store className="me-3" size={32} />}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row">
            <h3 className="text-lg font-bold text-left">{market.name}</h3>
          </div>
          <div className="flex flex-row text-gray-500 font-light min-w-0 max-w-full">
            <span className="min-w-0 truncate overflow-hidden whitespace-nowrap text-left">{market.address}</span>
            <span className="ps-3 ms-auto text-right max-w-fit min-w-fit">{market.distance} km</span>
          </div>
        </div>
      </div>
    </Button>
  );
}
