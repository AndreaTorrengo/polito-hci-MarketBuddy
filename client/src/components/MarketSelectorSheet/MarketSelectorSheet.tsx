"use client";
import { List, ListItem, TextInput } from "@tremor/react";
import { Sheet } from "react-modal-sheet";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import { Market } from "../../models";
import TorinoMarkets from "../../markets.json";



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

export default function MarketSelectorSheet({ selectedMarket, setSelectedMarket }: Readonly<{
  selectedMarket: Market;
  setSelectedMarket: (market: Market) => void;
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
      if (b.name=== selectedMarket.name) return 1;
      return a.distance - b.distance;
    });
    setMarkets(modifiedMarkets);
  }, [selectedMarket]);


  return (
    <>
      <button className="font-bold py-2 px-4 inline-flex items-center dark:text-dark-tremor-content-strong animated dark:active:text-dark-tremor-content-emphasis active:scale-subtle" onClick={() => setIsOpen(true)}>
        <LocationOnOutlinedIcon />
        <span className="ml-2">{selectedMarket.name}</span>
        <ExpandMoreIcon />
      </button>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' mountPoint={approot} >
        <Sheet.Container>
          <Sheet.Header className="dark:bg-dark-tremor-background dark:text-dark-tremor-content-emphasis" />
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
    icon={SearchIcon}
    onChange={(e) => setSearchInput(e.target.value)}
    value={searchInput}
  />;
}

function MarketsList({ selectMarket, searchInput, selectedMarket, markets }: Readonly<{ selectMarket: (market: Market) => void, searchInput: string, selectedMarket: Market, markets: Market[] }>) {
  return (
    <List className="w-auto mx-8 my-2 py-2">
      {markets.map((market) => (
        (searchInput === "" || market.name.toLowerCase().includes(searchInput.toLowerCase())) &&
        <ListItem key={market.id} className="p-2 animated active:scale-subtle active:bg-tremor-background-subtle dark:active:bg-dark-tremor-background-subtle">
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
    <button className="justify-start w-full " onClick={() => selectMarket(market)}>
      <div className="flex flex-row items-center text-tremor-content-strong dark:text-dark-tremor-content-emphasis w-full">
        <div className="flex flex-col">
          {(market.name === selectedMarket.name) ? <NearMeOutlinedIcon className="me-2" fontSize="large" /> :
            <StorefrontOutlinedIcon className="me-2" fontSize="large" />}
        </div>
        <div className="flex flex-col grow">
          <div className="flex flex-row grow">
            <h3 className="text-lg font-bold text-left w-full grow">{market.name}</h3>
          </div>
          <div className="flex flex-row justify-between text-gray-500">
            <p className="flex truncate whitespace-nowrap">{market.address}</p>
            <p className="ms-4 text-right max-w-fit min-w-fit">{market.distance} km</p>
          </div>
        </div>
      </div>
    </button>
  );
}
