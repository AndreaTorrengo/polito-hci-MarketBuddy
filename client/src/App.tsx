import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import PageShoppingList from "./components/PageShoppingList/PageShoppingList";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PageMap from "./components/PageMap/PageMap";
import TabsHero from "./components/TabSelector/TabSelector";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import currentMarket from './currentMarket.json';
import { Vendor, Product } from './models';
import API from './API';

export default function App() {
  const paths = ["/", "/quests", "/rewards", "/profile", "/map", "*"];

  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([
    new Vendor(6, 'Alberto', 'Market 1', [
      45.076796,
      7.683614
    ], 4.5, 4.0, 4.8, 1.2, ['Food'], ['Badge 1'], [
      new Product(1, 'Product 1', 10),
      new Product(2, 'Product 2', 20),
    ]),
    new Vendor(2, 'Vendor 2', 'Market 2', [
      45.076696,
      7.683614
    ], 4.0, 3.5, 4.5, 1.1, ['Clothing'], ['Badge 2'], [
      new Product(3, 'Product 3', 30),
      new Product(4, 'Product 4', 40),
    ]),
    new Vendor(3, 'Vendor 3', 'Market 3', [
      45.076896,
      7.683614
    ], 4.8, 4.2, 4.9, 1.3, ['Electronics'], ['Badge 3'], [
      new Product(5, 'Product 5', 50),
      new Product(6, 'Product 6', 60),
    ]),
  ]);


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

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const fetchedVendors = await API.getVendorsByMarket(currentMarket.marketName);
        setVendors(fetchedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, [currentMarket]);



  // 0-PageShoppingList, 1-PageQuest, 2-PageReward, 3-PageProfile, 4-PageNotFound
  return (
    <div className={'dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong' + (theme === 'dark' ? ' dark' : '')}>
      <Routes>
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<TabsHero theme={theme} vendors={vendors} filteredVendors={filteredVendors} />} />
          <Route path={`${paths[1]}`} element={<PageQuest setQuestPendingClaims={setQuestPendingClaims} />} />
          <Route path={`${paths[2]}`} element={<PageReward />} />
          <Route path={`${paths[3]}`} element={<PageProfile theme={theme} toggleTheme={toggleTheme} />} />
          <Route path={`${paths[5]}`} element={<PageNotFound />} />
        </Route>
      </Routes>
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