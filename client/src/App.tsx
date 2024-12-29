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
  const [sortByQuality, setSortByQuality] = useState(true);
  const [sortByConvenience, setSortByConvenience] = useState(true);
  const [sortByCordiality, setSortByCordiality] = useState(false);


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
    let sortedVendors = [...vendors];

    sortedVendors.sort((a, b) => {
      let comparison = 0;
      if (sortByQuality) {
        const qualityA = parseFloat(a.quality_rating.replace('%', ''));
        const qualityB = parseFloat(b.quality_rating.replace('%', ''));
        comparison = qualityB - qualityA;
      }
      if (comparison === 0 && sortByConvenience) {
        const convenienceA = parseFloat(a.convenience_rating.replace('%', ''));
        const convenienceB = parseFloat(b.convenience_rating.replace('%', ''));
        comparison = convenienceB - convenienceA;
      }
      if (comparison === 0 && sortByCordiality) {
        const CordialityA = parseFloat(a.cordiality_rating.replace('%', ''));
        const CordialityB = parseFloat(b.cordiality_rating.replace('%', ''));
        comparison = CordialityB - CordialityA;
      }
      return comparison;
    });

    
    const filtered = [];
    const requiredProducts = new Set(productsList.products);
    const foundProducts = new Set();

    for (const vendor of sortedVendors) {
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
          <Route index path={`${paths[0]}`} element={<PageShoppingList sortByQuality={sortByQuality} sortByConvenience={sortByConvenience} sortByCordiality={sortByCordiality} theme={theme} filteredVendors={filteredVendors} setFilteredVendors={setFilteredVendors} setMissingProducts={setMissingProducts} missingProducts={missingProducts} />} />
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