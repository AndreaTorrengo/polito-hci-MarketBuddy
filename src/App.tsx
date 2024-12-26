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
  const paths = ["/", "/quests", "/rewards", "/profile", "*"];

  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));


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

  // 0-PageShoppingList, 1-PageQuest, 2-PageReward, 3-PageProfile, 4-PageNotFound
  return (
    <div className={'dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong' + (theme === 'dark' ? ' dark' : '')}>
      <Routes>
        <Route element={<Layout paths={paths} />}>
          <Route index path={`${paths[0]}`} element={<PageShoppingList />} />
          <Route path={`${paths[1]}`} element={<PageQuest />} />
          <Route path={`${paths[2]}`} element={<PageReward />} />
          <Route path={`${paths[3]}`} element={<PageProfile theme={theme} toggleTheme={toggleTheme} />} />
          <Route path={`${paths[4]}`} element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout(props: any) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-y-auto">
          <Outlet />
        </div>
        <Navbar paths={props.paths} />
      </div>
    </>
  );
}
Layout.propTypes = {
  paths: PropTypes.array
}