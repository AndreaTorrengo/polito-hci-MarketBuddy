import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { DarkModeCustomSwitch } from './darkModeSwitch';
import API from '../../API';
import { Dispatch, SetStateAction, useContext } from 'react';
import { UserData } from './UserData';
import { Card, TextInput, Title } from '@tremor/react';
import { Button } from '../generalPurposeComponents/Button';
import globalContext from '../../Context';

interface PageProfileProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  askConfirmation: (onConfirm: () => void, text?: string, cancelButtonText?: string, confirmButtonText?: string) => void;
  userdata: UserData;
  setUserdata: Dispatch<SetStateAction<UserData>>;
}

export default function PageProfile({ theme, toggleTheme, userdata, setUserdata }: Readonly<PageProfileProps>) {

  const context = useContext(globalContext);
  const askConfirmation = context?.askConfirmation;
  const showToastMessage = context?.showToastMessage;

  function clearStorage() {
    askConfirmation && askConfirmation(() => {
      localStorage.clear();
      window.location.reload(); // not optimal but easier to manage for now
    },
      'Are you sure you want to clear local storage?');
  }

  function resetDB() {
    askConfirmation && askConfirmation(async () => {
      if (await API.resetDB() && showToastMessage) {
        showToastMessage("Database reset successfully!", "success");
      }
    },
      "Are you sure you want to reset the server's database?")
  }

  return (
    <div className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle px-6 py-4">
      <h1 className="page-title mb-4">Profile</h1>
      <Card className="flex flex-col p-4">
        <div className="grid gap-3 text-tremor-content dark:text-dark-tremor-content">

          <div className="flex items-center">
            <label htmlFor="color-theme-switch" className="min-w-32">Color theme:</label>
            <DarkModeCustomSwitch id="color-theme-switch" sx={{ m: 1 }}
              checked={theme === 'dark'} onChange={toggleTheme} />
          </div>

          <div className="flex items-center">
            <label htmlFor="username-input" className="min-w-32">Username:</label>
            <TextInput id="username-input" placeholder="Enter your username" value={userdata.username} disabled />
          </div>

          <div className="flex items-center">
            <label htmlFor="experience" className="min-w-32">Experience:</label>
            <div id="experience" className="flex items-center space-x-2 text-violet-600">
              <span className="font-semibold"><HexagonIcon /></span>
              <span className="font-semibold">{userdata.experience}</span>
            </div>
          </div>

          <div className="flex items-center">
            <label htmlFor="buddy-coins" className="min-w-32">Buddy coins:</label>
            <div id="buddy-coins" className="flex items-center space-x-2 text-yellow-500">
              <span className="font-semibold"><EmojiEmotionsIcon /></span>
              <span className="font-semibold">{userdata.coins}</span>
            </div>
          </div>

        </div>
      </Card>

      <div className="flex flex-col items-start border-red-500 dark:border-red-600 border-2 my-4 p-2 rounded-lg">
        <h2 className='text-red-500 dark:text-red-600'>DEBUG</h2>
        <Button color="danger" variant='contained' className="m-1" onClick={clearStorage}>Reset Local Storage</Button>
        <Button color="danger" variant='contained' className="m-1" onClick={resetDB}>Reset Server Database</Button>
      </div>

    </div>
  );
}
