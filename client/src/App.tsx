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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));
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
    // Carica la lista di prodotti dal file JSON

    //const productsList = List.products;

    // Filtra i venditori
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

    console.log("requiredProducts", Array.from(requiredProducts));
    console.log("foundProducts", Array.from(foundProducts));

    // Check for missing products
    const missing = Array.from(requiredProducts).filter(product =>
      !Array.from(foundProducts as Set<Product>).some((fp: Product) => fp.name === product)
    );
    setMissingProducts(missing);
    console.log("missing", missingProducts);

    setFilteredVendors(filtered);
    console.log("filtered", filtered);
  }, [vendors]);

  const handleMissingProducts = () => {
    const updatedFiltered = [...filteredVendors];
    const remainingMissingProducts: string[] = [];

    missingProducts.forEach(product => {
      if (window.confirm(`Desideri trovare proposte alternative per ${product}?`)) {
        updatedFiltered.push({
          id: updatedFiltered.length + 1,
          name: `SampleVendor#${updatedFiltered.length + 1}`,
          products: [{ id: updatedFiltered.length + 1, name: product, price: 0 }],
          position: '0,0', // Use the center of the market location
          market: 'Porta Palazzo',
          priceMultiplier: 1,
          quality_rating: 0,
          price_rating: 0,
          cordiality_rating: 0,
          categories: [], // Add appropriate categories
          badges: [] // Add appropriate badges
        });
      } else {
        remainingMissingProducts.push(product);
      }
    });

    setFilteredVendors(updatedFiltered);
    setMissingProducts(remainingMissingProducts); // Update missing products with the remaining ones
    console.log("filtered", updatedFiltered);
  };

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
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} handleMissingProducts={handleMissingProducts} missingProducts={missingProducts} />}>
          <Route index path={`${paths[0]}`} element={<PageShoppingList />} />
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
  const { handleMissingProducts, missingProducts } = props;
  return (
    <>
      {missingProducts.length > 0 && (
        <button onClick={handleMissingProducts}>Handle Missing Products</button>
      )}
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
  handleMissingProducts: PropTypes.func,
  missingProducts: PropTypes.array,
  questPendingClaims: PropTypes.number,
  setActiveTab: PropTypes.func.isRequired
}