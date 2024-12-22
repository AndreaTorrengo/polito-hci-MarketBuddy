"use client";
import { Button, List, TextInput } from "@tremor/react";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

export default function MarketSelectorSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("Crocetta Market");

  function selectMarket(name: string) {
    setSelectedMarket(name);
    setIsOpen(false);
  }

  return (
    <>
      <button className="text-black font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => setIsOpen(true)}>
        <LocationOnOutlinedIcon />
        <span className="ml-2">{selectedMarket}</span>
        <ExpandMoreIcon />
      </button>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' rootId="ShoppingListPage">
        <Sheet.Container>
          <Sheet.Header className="p-6">
            <h1 className="font-bold text-3xl">Choose The Market</h1>
            <Button variant="light" className="absolute top-6 right-6 text-4xl" color="slate" onClick={() => setIsOpen(false)}>
              <CloseIcon fontSize="large" className="align-middle" />
            </Button>
          </Sheet.Header>
          <Sheet.Content>
            <div className="mx-20 mt-2 mb-4">
              <SearchBar />
            </div>
            <MarketsList selectMarket={selectMarket} />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setIsOpen(false)} />
      </Sheet >
    </>
  );
}

function SearchBar() {
  return <TextInput
    placeholder="Search Markets"
    id="search"
    name="search"
    type="search"
    className="py-1 ps-4 rounded-full"
    icon={SearchIcon}
  />;
}

function MarketsList({ selectMarket }: { selectMarket: (name: string) => void }) {
  return (
    <List>
      <MarketCard name="Crocetta Market" address="Via Crocetta, 10123 Torino" selectMarket={selectMarket} />
      <MarketCard name="Porta Palazzo Market" address="Piazza della Repubblica, 10122 Torino" selectMarket={selectMarket} />
      <MarketCard name="Balon Market" address="Piazza della Repubblica, 10122 Torino" selectMarket={selectMarket} />
    </List>
  );

}

function MarketCard({ name, address, selectMarket: selectMarket }: { name: string, address: string, selectMarket: (name: string) => void }) {
  return (
    <Button className="w-full justify-start ms-2" onClick={() => selectMarket(name)} variant="light">
      <div className="flex p-4 my-2 border-0 items-center">
        <StorefrontOutlinedIcon className="text-black mx-2" fontSize="large" />
        <div className="ml-4">
          <h3 className="text-lg font-bold text-black text-left">{name}</h3>
          <p className="text-gray-500 text-left">{address}</p>
        </div>
      </div>
    </Button>
  );
}