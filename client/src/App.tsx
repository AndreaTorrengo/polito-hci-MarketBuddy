import { Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import PageShoppingList from "./components/PageShoppingList/PageShoppingList";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageRewardHistory from './components/PageReward/PageRewardHistory';
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PageLeaderboard from "./components/PageLeaderboard/PageLeaderboard";
import PropTypes from "prop-types";
import { useState } from "react";
import ConfirmPopup from "./components/ConfirmationPopup";

export default function App() {
  const paths = ["/", "/quests", "/rewards", "/profile", "*", "/leaderboard"];

  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [selectedMarket, setSelectedMarket] = useState("Crocetta Market");
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));

  const [popupText, setPopupText] = useState("Are you sure?");
  const [cancelButtonText, setCancelButtonText] = useState("Cancel");
  const [confirmButtonText, setConfirmButtonText] = useState("Confirm");
  const [confirmationCallback, setConfirmationCallback] = useState(() => { });
  const [showPopup, setShowPopup] = useState(false);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.theme) {
      if (theme === 'light') {
        setTheme('dark');
      }
      else {
        setTheme('light');
      }
    }
  });


  const toggleTheme = (event: any) => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.theme = 'light';
    }
    else {
      setTheme('dark');
      localStorage.theme = 'dark';
    }
  };

  const askConfirmation = (onConfirm: Function, text = "Are you sure?", cancelButtonText = "Cancel", confirmButtonText = "Confirm") => {
    setPopupText(text);
    setCancelButtonText(cancelButtonText);
    setConfirmButtonText(confirmButtonText);
    setConfirmationCallback(() => { return onConfirm });
    // console.log(confirmationCallback)
    setShowPopup(true);
  };

  // 0-PageShoppingList, 1-PageQuest, 2-PageReward, 3-PageProfile, 4-PageNotFound, 5-Leaderboard
  return (
    <div id="approot" className={'dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong' + (theme === 'dark' ? ' dark' : '')}>
      <Routes>
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<PageShoppingList selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />} />
          <Route path={`${paths[1]}`} element={<PageQuest setQuestPendingClaims={setQuestPendingClaims} leaderboardPath={`${paths[5]}`} />} />
          <Route path={`${paths[2]}`} element={<PageReward askConfirmation={askConfirmation} />} />
          <Route path={`${paths[2]}/history`} element={<PageRewardHistory />} />
          <Route path={`${paths[3]}`} element={<PageProfile theme={theme} toggleTheme={toggleTheme} />} />
          <Route path={`${paths[4]}`} element={<PageNotFound />} />
          <Route path={`${paths[5]}`} element={<PageLeaderboard/>} />
        </Route>
      </Routes>
      {showPopup &&
        <ConfirmPopup text={popupText} cancelButtonText={cancelButtonText} confirmButtonText={confirmButtonText} onConfirmCallback={confirmationCallback} closePopup={() => { setShowPopup(false); }} />
      }
    </div>
  );
}

function Layout(props: any) {
  return (
    <>
      <div className="flex flex-col h-screen bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
        <div className="flex-grow overflow-y-auto">
          <Outlet />
        </div>
        <Navbar paths={props.paths} activeTab={props.activeTab} setActiveTab={props.setActiveTab} questPendingClaims={props.questPendingClaims} />
      </div>
    </>
  );
}
Layout.propTypes = {
  paths: PropTypes.array,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
  questPendingClaims: PropTypes.number
}