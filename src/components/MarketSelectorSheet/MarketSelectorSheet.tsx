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

  return (
    <>
      <button className="text-black font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => setIsOpen(true)}>
        <LocationOnOutlinedIcon />
        <span className="ml-2">{selectedMarket}</span>
        <ExpandMoreIcon />
      </button>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent='content-height' rootId="ShoppingListPage">
        <Sheet.Container>
          <Sheet.Header className="p-4">
            <h1 className="font-bold text-3xl">Choose The Market</h1>
            <Button variant="light" className="absolute top-4 right-4 text-4xl" color="slate" onClick={() => setIsOpen(false)} icon={CloseIcon}>
            </Button>
          </Sheet.Header>
          <Sheet.Content>
            <div className="mx-16 mb-4">
              <SearchBar />
            </div>
            <MarketsList />
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

function MarketsList() {
  return (
    <List>
      <MarketCard name="Crocetta Market" address="Via Crocetta, 10123 Torino" />
      <MarketCard name="Porta Palazzo Market" address="Piazza della Repubblica, 10122 Torino" />
      <MarketCard name="Balon Market" address="Piazza della Repubblica, 10122 Torino" />
    </List>
  );

}

function MarketCard({ name, address }: Readonly<{ name: string; address: string }>) {
  return (
    <div className="p-4 my-2 border-0 flex items-center">
      <StorefrontOutlinedIcon className="text-black text-4xl" />
      <div className="ml-4">
        <h3 className="text-lg font-bold text-black">{name}</h3>
        <p className="text-gray-500">{address}</p>
      </div>
    </div>
  );
}