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
  const [selectedMarket, setSelectedMarket] = useState("Crocetta Market");

  console.log(selectedMarket);

  return (
    <Routes>
      <Route element={<Layout paths={paths} />}>
        <Route index path={`${paths[0]}`} element={<PageShoppingList key="ShoppingListPage" selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />} />
        <Route path={`${paths[1]}`} element={<PageQuest />} />
        <Route path={`${paths[2]}`} element={<PageReward />} />
        <Route path={`${paths[3]}`} element={<PageProfile />} />
        <Route path={`${paths[4]}`} element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

type LayoutProps =
  {
    paths: string[];
  }

function Layout(props: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      <Navbar paths={props.paths} />
    </div>
  );
}
Layout.propTypes = {
  paths: PropTypes.array
}