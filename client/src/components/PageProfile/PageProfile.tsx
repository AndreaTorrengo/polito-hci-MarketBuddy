import { FormControlLabel, FormGroup, } from '@mui/material';
import { DarkModeCustomSwitch } from './darkModeSwitch';
import API from '../../API';

interface PageProfileProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  askConfirmation: (onConfirm: () => void, text?: string, cancelButtonText?: string, confirmButtonText?: string) => void;
}

export default function PageProfile({ theme, toggleTheme, askConfirmation }: Readonly<PageProfileProps>) {

  function clearStorage() {
    askConfirmation(() => {
      localStorage.clear();
      window.location.reload(); // not optimal but easier to manage for now
    },
      'Are you sure you want to clear local storage?');
  }

  return (
    <>
      <h1>Profile page</h1>
      <FormGroup>
        <FormControlLabel
          control={<DarkModeCustomSwitch sx={{ m: 1 }}
            checked={theme === 'dark'} onChange={toggleTheme} />}
          label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />
      </FormGroup>
      <div className="flex flex-col items-start bg-red-500 m-4 p-2 rounded-lg">
        <h2>DEBUG</h2>
        <button className="rounded bg-red-400 p-2 m-1 animated active:bg-opacity-65" onClick={clearStorage}>Reset Local Storage</button>
        <button className="rounded bg-red-400 p-2 m-1 animated active:bg-opacity-65" onClick={() => { askConfirmation(API.resetDB, "Are you sure you want to reset the server's database?") }}>Reset Server Database</button>
      </div>
    </>
  );
}
