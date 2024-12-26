import { Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import PageShoppingList from "./components/PageShoppingList/PageShoppingList";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PropTypes from "prop-types";
import { useState } from "react";

export default function App() {
  // 0-PageShoppingList, 1-PageQuest, 2-PageReward, 3-PageProfile, 4-PageNotFound
  const paths = ["/", "/quests", "/rewards", "/profile", "*"];
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));

  return (
    <>
      <Routes>
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<PageShoppingList />} />
          <Route path={`${paths[1]}`} element={<PageQuest
            setQuestPendingClaims={setQuestPendingClaims}
          />} />
          <Route path={`${paths[2]}`} element={<PageReward />} />
          <Route path={`${paths[3]}`} element={<PageProfile />} />
          <Route path={`${paths[4]}`} element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
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