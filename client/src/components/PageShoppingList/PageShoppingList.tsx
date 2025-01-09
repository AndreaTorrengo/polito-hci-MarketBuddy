import MarketSelectorSheet from "../MarketSelectorSheet/MarketSelectorSheet";
import { Fab, Typography } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from "react-router";


export default function PageShoppingList() {
  const navigate = useNavigate();

  return (
    <>
      <h3>Shopping List page ._.</h3>
      <MarketSelectorSheet />
      <h1 className="pt-64">Hi 1</h1>
      <h1 className="pt-64">Hi 2</h1>
      <h1 className="pt-64">Hi 3</h1>
      <h1 className="pt-64">Hi 4</h1>
    </>
  );
}
