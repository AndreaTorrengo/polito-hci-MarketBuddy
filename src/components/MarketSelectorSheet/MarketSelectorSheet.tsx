"use client";
import { Button, List, ListItem, TextInput } from "@tremor/react";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

const markets = [ // To be replaced with a call to the db
  { id: "1", name: "Crocetta Market", address: "Via Crocetta, 10123 Torino" },
  { id: "2", name: "Porta Palazzo Market", address: "Piazza della Repubblica, 10122 Torino" },
  { id: "3", name: "Balon Market", address: "Piazza della Repubblica, 10122 Torino" }
]



export default function MarketSelectorSheet({ selectedMarket, setSelectedMarket }: Readonly<{ selectedMarket: string, setSelectedMarket: (market: string) => void }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  function selectMarket(name: string) {
    setSelectedMarket(name);
    setIsOpen(false);
  }

  return (
    <>
      <button className="font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => setIsOpen(true)}>
        <LocationOnOutlinedIcon />
        <span className="ml-2">{selectedMarket}</span>
        <ExpandMoreIcon />
      </button>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' rootId="ShoppingListPage">
        <Sheet.Container>
          <Sheet.Header className="p-6 dark:bg-dark-tremor-background dark:text-dark-tremor-content-emphasis">
            <h1 className="font-bold text-3xl">Choose The Market</h1>
            <Button variant="light" className="absolute top-6 right-6 text-4xl" color="slate" onClick={() => setIsOpen(false)}>
              <CloseIcon fontSize="large" className="align-middle text-tremor-content-strong dark:text-dark-tremor-content-emphasis" />
            </Button>
          </Sheet.Header>
          <Sheet.Content className="pb-8 dark:bg-dark-tremor-background">
            <div className="mx-20 mt-2 mb-4">
              <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
            </div>
            <MarketsList selectMarket={selectMarket} searchInput={searchInput} />
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

function MarketsList({ selectMarket, searchInput }: Readonly<{ selectMarket: (name: string) => void, searchInput: string }>) {
  return (
    <List className="w-auto mx-10 my-2 py-2">
      {markets.map((market, index) => (
        (searchInput === "" || market.name.toLowerCase().includes(searchInput.toLowerCase())) &&
        <>
          {/* {index != 0 &&
            <hr className="border-gray-200 border-1 mx-4" />} */}
          <ListItem key={market.id} className="border-t-0">
            <MarketCard name={market.name} address={market.address} selectMarket={selectMarket} />
          </ListItem>
        </>
      ))}
    </List>
  );
}

function MarketCard({ name, address, selectMarket }: Readonly<{ name: string, address: string, selectMarket: (name: string) => void }>) {
  return (
    <Button className="justify-start" onClick={() => selectMarket(name)} variant="light">
      <div className="flex items-center text-tremor-content-strong dark:text-dark-tremor-content-emphasis">
        <StorefrontOutlinedIcon className="me-2" fontSize="large" />
        <div>
          <h3 className="text-lg font-bold text-left">{name}</h3>
          <p className="text-gray-500 text-left">{address}</p>
        </div>
      </div>
    </Button>
  );
}