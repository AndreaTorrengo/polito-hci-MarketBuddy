import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageRewardHistory from './components/PageReward/PageRewardHistory';
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PageLeaderboard from "./components/PageLeaderboard/PageLeaderboard";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import API from "./API";
import { Vendor, Product, Market } from "./models";
import ConfirmPopup from "./components/ConfirmationPopup";
import TabsHero from "./components/TabSelector/TabSelector";


export default function App() {
  const paths = ["/", "/quests", "/rewards", "/profile", "*", "/leaderboard"];
  const [theme, setTheme] = useState<string>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [selectedMarket, setSelectedMarket] = useState<Market>({
    id: 1,
    name: "Porta Palazzo Market",
    position: [
      45.076796,
      7.683614
    ],
    address: "Piazza della Repubblica, 10122 Torino TO, Italy",
    distance: 0.5
  });
  const [questPendingClaims, setQuestPendingClaims] = useState(0);
  const [activeTab, setActiveTab] = useState(paths.indexOf(window.location.pathname));
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [missingProducts, setMissingProducts] = useState<string[]>([]);
  const [sortByQuality, setSortByQuality] = useState(true);
  const [sortByConvenience, setSortByConvenience] = useState(true);
  const [sortByCordiality, setSortByCordiality] = useState(false);
  const [productsList, setProductsList] = useState<{ [key: string]: string[] }>({
    "Porta Palazzo Market": [
      "Lettuce",
      "Carrot",
      "Pears",
      "Chicken Breast",
      "Milk",
      "Salmon",
      "Bream"
    ],
    "Santa Rita Market": [
      "Lettuce",
      "Carrot",
      "Pears",
      "Chicken Breast",
      "Milk",
      "Salmon",
      "Bream"
    ],
    "Crocetta Market": [
      "Lettuce",
      "Carrot",
      "Pears",
      "Chicken Breast",
      "Milk",
      "Salmon",
      "Bream"
    ],
  });




  useEffect(() => {
    const fetchVendors = async () => {
      try {

        const vendors = await API.getVendorsByMarket(selectedMarket.name);
        setVendors(vendors);

      }
      catch (error) {
        console.error(error);
      }
    }
    fetchVendors();
  }, [selectedMarket]);


  const updateVendorsAndProducts = () => {
    const savedProductsList = localStorage.getItem('productsList');
    const productsListState = savedProductsList ? JSON.parse(savedProductsList) : productsList;
    let sortedVendors: Vendor[] = [...vendors];

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
        const cordialityA = parseFloat(a.cordiality_rating.replace('%', ''));
        const cordialityB = parseFloat(b.cordiality_rating.replace('%', ''));
        comparison = cordialityB - cordialityA;
      }
      return comparison;
    });

    const filtered: Vendor[] = [];
    if (productsListState[selectedMarket.name]) {
      const requiredProducts = new Set(productsListState[selectedMarket.name]);

      const foundProducts = new Set<Product>();

      for (const vendor of sortedVendors) {
        const filteredProducts = vendor.products.filter((product: Product) =>
          productsListState[selectedMarket.name].includes(product.name),
        );





        if (filteredProducts.length > 0) {
          const newVendor = {
            ...vendor,
            products: filteredProducts
          };
          filtered.push(newVendor);
          filteredProducts.forEach((product: Product) => foundProducts.add(product));
        }

        const allRequiredProductsFound = Array.from(requiredProducts as Set<string>).every((product: string) =>
          Array.from(foundProducts as Set<Product>).some((fp: Product) => fp.name === product)
        );

        if (allRequiredProductsFound) {
          break;
        }
      }

      // Check for missing products
      const missing: string[] = Array.from(requiredProducts as Set<string>).filter(product =>
        !Array.from(foundProducts).some((fp: Product) => fp.name === product)
      );

      setMissingProducts(missing);
      setFilteredVendors(filtered);


    } else {
      console.error(`Market ${selectedMarket.name} not found in productsList`);
    }
  };

  useEffect(() => {
    updateVendorsAndProducts();
  }, [vendors]);




  const [popupText, setPopupText] = useState("Are you sure?");
  const [cancelButtonText, setCancelButtonText] = useState("Cancel");
  const [confirmButtonText, setConfirmButtonText] = useState("Confirm");
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(() => { });
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
    <div id='approot' className={'dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong' + (theme === 'dark' ? ' dark' : '')}>
      <Routes>
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<TabsHero theme={theme} vendors={vendors} filteredVendors={filteredVendors} selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} missingProducts={missingProducts} updateVendorsAndProducts={updateVendorsAndProducts} productsList={productsList} setProductsList={setProductsList} />} />
          <Route path={`${paths[1]}`} element={<PageQuest setQuestPendingClaims={setQuestPendingClaims} leaderboardPath={`${paths[5]}`} />} />
          <Route path={`${paths[2]}`} element={<PageReward askConfirmation={askConfirmation} />} />
          <Route path={`${paths[2]}/history`} element={<PageRewardHistory />} />
          <Route path={`${paths[3]}`} element={<PageProfile theme={theme} toggleTheme={toggleTheme} />} />
          <Route path={`${paths[4]}`} element={<PageNotFound />} />
          <Route path={`${paths[5]}`} element={<PageLeaderboard />} />
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
  questPendingClaims: PropTypes.number,
  setActiveTab: PropTypes.func.isRequired
}