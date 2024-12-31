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
      <Fab
        variant="extended"
        color="primary"
        aria-label="show on map"
        size="small"
        sx={{
          position: 'fixed',
          bottom: '65px',
          right: '20px',
          minWidth: '100px', // Imposta una larghezza minima
          padding: '0 10px',
        }}
        onClick={() => navigate('/map')}
      >
        <MapIcon sx={{ mr: 1 }} />
        <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>Show on Map</Typography>
      </Fab>
    </>
  );
}
