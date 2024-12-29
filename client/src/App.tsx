import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import PageShoppingList from "./components/PageShoppingList/PageShoppingList";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import API from "./API";
import { Vendor, Product } from "./models";
import productsList from './productsList.json';

export default function App() {
  const paths = ["/", "/quests", "/rewards", "/profile", "*"];
  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [missingProducts, setMissingProducts] = useState<string[]>([]);


  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendors = await API.getVendorsByMarket('Porta Palazzo');
        setVendors(vendors);
        console.log("original ", vendors);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVendors();

  }, []);

  useEffect(() => {

    const filtered = [];
    const requiredProducts = new Set(productsList.products);
    const foundProducts = new Set();

    for (const vendor of vendors) {
      const filteredProducts = vendor.products.filter(product => productsList.products.includes(product.name));
      if (filteredProducts.length > 0) {
        filtered.push({ ...vendor, products: filteredProducts });
        filteredProducts.forEach(product => foundProducts.add(product));
      }
      if (Array.from(requiredProducts).every(product => foundProducts.has(product))) {
        break;
      }
    }

    // Check for missing products
    const missing = Array.from(requiredProducts).filter(product =>
      !Array.from(foundProducts as Set<Product>).some((fp: Product) => fp.name === product)
    );
    setMissingProducts(missing);
    setFilteredVendors(filtered);
  }, [vendors]);



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
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<PageShoppingList theme={theme} filteredVendors={filteredVendors} setFilteredVendors={setFilteredVendors}  setMissingProducts={setMissingProducts} missingProducts={missingProducts}/>} />
          <Route path={`${paths[1]}`} element={<PageQuest setQuestPendingClaims={setQuestPendingClaims} />} />
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
  questPendingClaims: PropTypes.number,
  setActiveTab: PropTypes.func.isRequired
}