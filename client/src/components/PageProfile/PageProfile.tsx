import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { DarkModeCustomSwitch } from './darkModeSwitch';
import API from '../../API';
import { Dispatch, SetStateAction } from 'react';
import { UserData } from './UserData';
import { Card, TextInput, Title } from '@tremor/react';

interface PageProfileProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  askConfirmation: (onConfirm: () => void, text?: string, cancelButtonText?: string, confirmButtonText?: string) => void;
  userdata: UserData;
  setUserdata: Dispatch<SetStateAction<UserData>>;
}

export default function PageProfile({ theme, toggleTheme, askConfirmation, userdata, setUserdata }: Readonly<PageProfileProps>) {

  function clearStorage() {
    askConfirmation(() => {
      localStorage.clear();
      window.location.reload(); // not optimal but easier to manage for now
    },
      'Are you sure you want to clear local storage?');
  }

  return (
    <>
      <div className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle p-6">
        <Title className="text-center text-4xl mb-6">Profile</Title>
        
        <Card className="flex flex-col p-4">
          <div className="grid gap-3 text-tremor-content dark:text-dark-tremor-content">

            <div className="flex items-center">
              <label className="min-w-32">Color theme:</label>
              <DarkModeCustomSwitch sx={{ m: 1 }}
                checked={theme === 'dark'} onChange={toggleTheme} />
            </div>

            <div className="flex items-center">
              <label className="min-w-32">Username:</label>
              <TextInput placeholder="Enter your username" value={userdata.username} disabled/>
            </div>

            <div className="flex items-center">
              <label className="min-w-32">Experience:</label>
              <div className="flex items-center space-x-2 text-violet-600">
                <span className="font-semibold"><HexagonIcon /></span>
                <span className="font-semibold">{userdata.experience}</span>
              </div>
            </div>

            <div className="flex items-center">
              <label className="min-w-32">Buddy coins:</label>
              <div className="flex items-center space-x-2 text-yellow-500">
                <span className="font-semibold"><EmojiEmotionsIcon /></span>
                <span className="font-semibold">{userdata.coins}</span>
              </div>
            </div>

          </div>
        </Card>

        <div className="flex flex-col items-start bg-red-500 my-4 p-2 rounded-lg">
          <h2>DEBUG</h2>
          <button className="rounded bg-red-400 p-2 m-1 animated active:bg-opacity-65" onClick={clearStorage}>Reset Local Storage</button>
          <button className="rounded bg-red-400 p-2 m-1 animated active:bg-opacity-65" onClick={() => { askConfirmation(API.resetDB, "Are you sure you want to reset the server's database?") }}>Reset Server Database</button>
        </div>

      </div>
    </>
  );
}
