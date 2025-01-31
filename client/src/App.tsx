import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import PageQuest from "./components/PageQuest/PageQuest";
import PageReward from "./components/PageReward/PageReward";
import PageRewardHistory from './components/PageReward/PageRewardHistory';
import PageProfile from "./components/PageProfile/PageProfile";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PageLeaderboard from "./components/PageLeaderboard/PageLeaderboard";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import API from "./API";
import { Vendor, Product, Market } from "./models";
import ConfirmPopup from "./components/ConfirmationPopup";
import TabsHero from "./components/TabSelector/TabSelector";
import PageAddProducts from "./components/PageAddProducts/PageAddProducts.tsx";
import FeedbackDeleteDialog from "./FeedbackDeleteDialog";
import FeedbackSwitchDialog from "./FeedbackSwitchDialog";
import FeedbackReportDialog from "./FeedbackReportDialog";


export default function App() {
  const paths = ["/", "/quests", "/rewards", "/profile", "*", "/leaderboard", "/addProducts", "/addProducts/:id"];
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
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
        const vendorsKey = `vendors_${selectedMarket.name}`;
        const savedVendors = localStorage.getItem(vendorsKey);
        if (savedVendors) {
          const parsedVendors = JSON.parse(savedVendors);
          if (parsedVendors.length > 0) {
            setVendors(parsedVendors);
            return;
          }
        }

        const vendors = await API.getVendorsByMarket(selectedMarket.name);
        setVendors(vendors);
        localStorage.setItem(vendorsKey, JSON.stringify(vendors));
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      }
    };

    fetchVendors();
  }, [selectedMarket]);


  const updateVendorsAndProducts = () => {

    const savedProductsList = localStorage.getItem('productsList');
    const productsListState = savedProductsList ? JSON.parse(savedProductsList) : productsList;



    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const missingProductsKey = `missingProducts_${selectedMarket.name}`;


    const savedFilteredVendors = localStorage.getItem(filteredVendorsKey);


    if (savedFilteredVendors && JSON.parse(savedFilteredVendors).length > 0) {
      setFilteredVendors(JSON.parse(savedFilteredVendors));
      return;
    }

    const sortedVendors: Vendor[] = [...vendors];

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
      const foundProducts = new Set<string>(); // Use Set<string> to track found product names
      for (const vendor of sortedVendors) {
        const filteredProducts = vendor.products.filter((product: Product) =>
          productsListState[selectedMarket.name].includes(product.name) && !foundProducts.has(product.name),
        );
        if (filteredProducts.length > 0) {
          const newVendor = {
            ...vendor,
            products: filteredProducts
          };
          filtered.push(newVendor);
          filteredProducts.forEach((product: Product) => foundProducts.add(product.name)); // Track found product names
        }
        const allRequiredProductsFound = Array.from(requiredProducts as Set<string>).every((product: string) =>
          foundProducts.has(product)
        );

        if (allRequiredProductsFound) {
          break;
        }
      }

      // Check for missing products
      const missing: string[] = Array.from(requiredProducts as Set<string>).filter(product =>
        !foundProducts.has(product)
      );
      setFilteredVendors(filtered);

      localStorage.setItem(filteredVendorsKey, JSON.stringify(filtered));
      localStorage.setItem(missingProductsKey, JSON.stringify(missing));

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

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.theme) {
      if (theme === 'light') {
        setTheme('dark');
      }
      else {
        setTheme('light');
      }
    }
  });

  const selectMarket = (market: Market) => {
    localStorage.market = market;
    setSelectedMarket(market);
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.theme = 'light';
    }
    else {
      setTheme('dark');
      localStorage.theme = 'dark';
    }
  };

  const askConfirmation = (onConfirm: () => void, text = "Are you sure?", cancelButtonText = "Cancel", confirmButtonText = "Confirm") => {
    setPopupText(text);
    setCancelButtonText(cancelButtonText);
    setConfirmButtonText(confirmButtonText);
    setConfirmationCallback(() => { return onConfirm });
    // console.log(confirmationCallback)
    setShowPopup(true);
  };
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<string | null>(null);
  // 0-PageShoppingList, 1-PageQuest, 2-PageReward, 3-PageProfile, 4-PageNotFound, 5-Leaderboard
  return (
    <div id='approot' className={'dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong' + (theme === 'dark' ? ' dark' : '')}>
      <FeedbackDeleteDialog
        isOpen={isFeedbackDialogOpen === 'delete'}
        onClose={() => { setIsFeedbackDialogOpen(null)}}
        theme={theme}
      />
      <FeedbackSwitchDialog
        isOpen={isFeedbackDialogOpen === 'switch'}
        onClose={() => { setIsFeedbackDialogOpen(null) }}
        theme={theme}
      />
      <FeedbackReportDialog
        isOpen={isFeedbackDialogOpen === 'report'}
        onClose={() => { setIsFeedbackDialogOpen(null) }}
        theme={theme}
      />
      <Routes>
        <Route element={<Layout paths={paths} activeTab={activeTab} setActiveTab={setActiveTab} questPendingClaims={questPendingClaims} />}>
          <Route index path={`${paths[0]}`} element={<TabsHero isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen} theme={theme} vendors={vendors} filteredVendors={filteredVendors} setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket} setSelectedMarket={selectMarket} missingProducts={missingProducts} updateVendorsAndProducts={updateVendorsAndProducts} productsList={productsList} setProductsList={setProductsList} />} />
          <Route path={`${paths[1]}`} element={<PageQuest setQuestPendingClaims={setQuestPendingClaims} leaderboardPath={`${paths[5]}`} />} />
          <Route path={`${paths[2]}`} element={<PageReward askConfirmation={askConfirmation} />} />
          <Route path={`${paths[2]}/history`} element={<PageRewardHistory />} />
          <Route path={`${paths[3]}`} element={<PageProfile theme={theme} toggleTheme={toggleTheme} askConfirmation={askConfirmation} />} />
          <Route path={`${paths[4]}`} element={<PageNotFound />} />
          <Route path={`${paths[5]}`} element={<PageLeaderboard />} />
          <Route path={`${paths[6]}`} element={<PageAddProducts setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket} actualVends={filteredVendors} allVends={vendors} theme={theme} />} />
          <Route path={`${paths[7]}`} element={<PageAddProducts setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket} actualVends={filteredVendors} allVends={vendors} theme={theme} />} />
        </Route>
      </Routes>
      {showPopup &&
        <ConfirmPopup text={popupText} cancelButtonText={cancelButtonText} confirmButtonText={confirmButtonText} onConfirmCallback={confirmationCallback} closePopup={() => { setShowPopup(false); }} />
      }
    </div>
  );
}

function Layout(props: Readonly<{ paths: string[], activeTab: number, questPendingClaims: number, setActiveTab: (tab: number) => void }>) {
  return (
    <div className="flex flex-col h-screen bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
      <div className="flex-grow overflow-y-auto flex-1">
        <Outlet />
      </div>
      <Navbar paths={props.paths} activeTab={props.activeTab} setActiveTab={props.setActiveTab} questPendingClaims={props.questPendingClaims} />
    </div>
  );
}
Layout.propTypes = {
  paths: PropTypes.array,
  activeTab: PropTypes.number,
  questPendingClaims: PropTypes.number,
  setActiveTab: PropTypes.func.isRequired
}