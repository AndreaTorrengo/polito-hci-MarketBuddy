import React, {useState, useEffect, useMemo} from 'react';
import PageMap from '../PageMap/PageMap.tsx';
import { Market, Vendor, Product } from '../../models.ts';
import PageShoppingList from '../PageShoppingList/PageShoppingList.tsx';
import MarketSelectorSheet from '../MarketSelectorSheet/MarketSelectorSheet.tsx';
import {ButtonBase} from "@mui/material";
import SwitchButton from "../PageVendorProducts/SwitchButton.tsx";
import SignalErrorButton from "../PageVendorProducts/SignalErrorButton.tsx";
import DeleteButton from "../PageVendorProducts/DeleteButton.tsx";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import {TextInput} from "@tremor/react";
import {Circle, CircleCheckBig, Search} from "lucide-react";
import AddProductsButton from "../PageVendorProducts/AddProductsButton.tsx";
import PageAddProducts from "../PageAddProducts/PageAddProducts.tsx";
import {UserData} from '../PageProfile/UserData.tsx';

interface TabsHeroProps {
    vendors: Vendor[];
    filteredVendors: Vendor[];
    selectedMarket: Market;
    setSelectedMarket: (selectedMarket: Market) => void;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    selectedReasons: string[];
    setSelectedReasons: React.Dispatch<React.SetStateAction<string[]>>;
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
    productsWithoutAlternatives: Product[];
    userdata: UserData;
    setUserdata: React.Dispatch<React.SetStateAction<UserData>>;
}

export default function TabsHero({
                                     vendors,
                                     filteredVendors,
                                     selectedMarket,
                                     setSelectedMarket,
                                     productsList,
                                     setProductsList,
                                     setFilteredVendors,
                                     selectedReasons,
                                     setSelectedReasons,
                                     productsWithoutAlternatives,
                                     setProductsWithoutAlternatives,
                                     userdata,
                                     setUserdata,
}: Readonly<TabsHeroProps>): JSX.Element {

    const [selectedProducts, setSelectedProducts] = useState<Map<number, number[]> | null>(null);
    const [filteredProductsVendors, setFilteredProductsVendors] = useState<Vendor[]>(filteredVendors); //vendors with filtered products
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [addProductId, setAddProductId] = useState<number | null>(null) //the id is -1 in case of add Products from shopping list page or vendorId from vendor Page

    //total number of products
    const totalProducts = useMemo(() => filteredVendors.reduce((acc, vendor) => acc + vendor.products.length, 0), [filteredVendors]);

    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') ?? 'list';
    });

    const changeTab = (newTab?: string) => {
        if (!newTab)
            newTab = activeTab === 'list' ? 'map' : 'list';
        setActiveTab(newTab);
        localStorage.setItem('activeTab', newTab);
    }

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    //open edit mode when selecting a product
    const openEditMode = (vendorId: number, productId: number) => {
        const newMap = new Map<number, number[]>();
        if(productId == -1) {
            newMap.set(vendorId, filteredVendors.find(vendor => vendor.id === vendorId)?.products.map(product => product.id) ?? []);
        }
        else {
            newMap.set(vendorId, [productId]);
        }
        setSelectedProducts(newMap);

        //disable filter when in edit mode
        setSearchInput("");

        setIsEditMode(true);
    };

    const exitEditMode = () => {
        setIsEditMode(false);
        setSelectedProducts(null);
    }

    //add or remove selected products in edit mode
    function addOrRemoveSelected(vendorId: number, productId: number) {
        if (!selectedProducts && !isEditMode) {
            return;
        }
        if (!selectedProducts) {
            throw new Error('Selected products map is null');
        }

        if (selectedProducts.has(vendorId)) {
            if (selectedProducts.get(vendorId)?.includes(productId)) {
                const updatedProducts = selectedProducts.get(vendorId)?.filter((product) => product !== productId);
                if (updatedProducts && updatedProducts.length > 0) {
                    selectedProducts.set(vendorId, updatedProducts);
                } else {
                    selectedProducts.delete(vendorId);
                }
            } else {
                selectedProducts.set(vendorId, [...selectedProducts.get(vendorId)!, productId]);
            }
        } else {
            selectedProducts.set(vendorId, [productId]);
        }
        setSelectedProducts(new Map(selectedProducts));
    }

    function selectAllProducts() {
        const newMap = new Map<number, number[]>();
        filteredVendors.forEach((vendor) => {
            const productIds = vendor.products.map((product) => product.id);
            newMap.set(vendor.id, productIds);
        });
        setSelectedProducts(newMap);
    }

    function selectedOrRemoveAllProductsFromVendor(vendorId: number, remove: boolean) {
        const vendor = filteredVendors.find((vendor) => vendor.id === vendorId);
        if (vendor) {
            const newSelectedProducts = new Map(selectedProducts);
            if (remove) {
                newSelectedProducts.delete(vendorId);
            } else {
                const productIds = vendor.products.map((product) => product.id);
                newSelectedProducts.set(vendorId, productIds);
            }
            setSelectedProducts(newSelectedProducts);
        }
    }

    //count selected products
    function countSelectedProducts() {
        let count = 0;
        if (selectedProducts) {
            selectedProducts.forEach((products) => {
                count += products.length;
            });
        }
        return count;
    }

    //Products Filtering
    const filterVendorsByState = () => {
        if (searchInput) {
            setFilteredProductsVendors(filteredVendors.map(vendor => ({
                ...vendor,
                products: vendor.products.filter(product => product.name.toLowerCase().includes(searchInput.toLowerCase()))
            })));
        } else {
            setFilteredProductsVendors(filteredVendors);
        }
    };

    useEffect(() => {
        filterVendorsByState();
    }, [searchInput, filteredVendors]);

    //delete selected products in edit mode
    function closeAfter() {
        setIsEditMode(false);
        setSelectedProducts(null);
    }

    // Link vendor position to the map
    const [initialSelectedMapVendor, setInitialSelectedMapVendor] = useState<Vendor | null>(null);

    return (
        <>
            {addProductId != null ?
                <PageAddProducts setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket}
                    actualVends={filteredVendors} allVends={vendors}
                                 setAddProductId={setAddProductId} addProductId={addProductId}/> :
                <div className="flex flex-col h-full min-h-0 px-6 py-4">
                    {
                        isEditMode ?
                            <>
                                <TopBar
                                    leftComponent={<ButtonBase className="text-md font-semibold" onClick={exitEditMode}>
                                        <p
                                            className="m-0 p-0">Cancel</p></ButtonBase>}
                                    centerComponent={<h1
                                        className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (countSelectedProducts() + " Selected") : ""}</h1>}
                                    rightComponent={
                                        <div className='flex gap-3 items-center'>
                                            {selectedProducts && selectedProducts.size > 0 &&
                                                <>
                                                    {/*<SwitchButton
                                                        setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                        selectedMarket={selectedMarket}
                                                        selectedProducts={selectedProducts}
                                                        setFilteredVendors={setFilteredVendors} theme={theme}
                                                        closeAfter={closeAfter}/>
                                                    <SignalErrorButton
                                                        selectedMarket={selectedMarket}
                                                        selectedProducts={selectedProducts}
                                                        closeAfter={closeAfter}
                                                        setFilteredVendors={setFilteredVendors}/>
                                                    <DeleteButton
                                                        selectedMarket={selectedMarket}
                                                        selectedProducts={selectedProducts}
                                                        setFilteredVendors={setFilteredVendors} theme={theme}
                                                        closeAfter={closeAfter}/>*/}
                                                </>}
                                            {
                                                selectedProducts && countSelectedProducts() === totalProducts ?
                                                    <button className="flex items-center justify-center" onClick={
                                                        () => {
                                                            setSelectedProducts(new Map());
                                                        }
                                                    }>
                                                        <CircleCheckBig size={20}/>
                                                    </button>
                                                    :
                                                    <button
                                                        className="flex items-center justify-center"
                                                        onClick={
                                                            () => {
                                                                selectAllProducts();
                                                            }
                                                        }>
                                                        <Circle size={20} color="gray"/>
                                                    </button>

                                            }

                                        </div>
                                    }/>
                                <div
                                    className="absolute w-full bottom-0 left-0 z-[11] pb-2 pt-2.5 dark:bg-dark-tremor-background-muted bg-tremor-background-muted border-t-[1px] border-tremor-border dark:border-dark-tremor-border">
                                    <div className={`flex flex-row items-center justify-around px-2 py-0.5 ${selectedProducts && selectedProducts.size > 0 ? "" : "opacity-50 pointer-events-none"}`}>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <SwitchButton
                                                    setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                    selectedMarket={selectedMarket}
                                                selectedProducts={selectedProducts || new Map<number, number[]>()}
                                                setFilteredVendors={setFilteredVendors}
                                                    closeAfter={closeAfter}>
                                                <p className="p-0 m-0 text-sm">Switch Vendor</p>
                                                </SwitchButton>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <SignalErrorButton
                                                    selectedMarket={selectedMarket}
                                                selectedProducts={selectedProducts || new Map<number, number[]>()}
                                                    closeAfter={closeAfter}
                                                    setFilteredVendors={setFilteredVendors}>
                                                <p className="p-0 m-0 text-sm">Report Issue</p>
                                                </SignalErrorButton>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 w-1/3">
                                                <DeleteButton
                                                    selectedMarket={selectedMarket}
                                                selectedProducts={selectedProducts || new Map<number, number[]>()}
                                                setFilteredVendors={setFilteredVendors}
                                                    closeAfter={closeAfter}>
                                                <p className="p-0 m-0 text-sm">Delete</p>
                                                </DeleteButton>
                                            </div>
                                        </div>
                                </div>
                            </>
                            :
                            <>
                                <div className='flex justify-between mb-4'>
                                    <h1 className="page-title mr-auto">Shopping</h1>
                                    <MarketSelectorSheet className="!p-0" selectedMarket={selectedMarket}
                                                         setSelectedMarket={setSelectedMarket}/>
                                </div>
                                <div className='flex flex-row gap-6 items-center'>
                                    <TextInput
                                        placeholder="Search Products"
                                        id="search"
                                        name="search"
                                        type="search"
                                        className="py-1 ps-3 rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle"
                                        icon={Search}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        value={searchInput}
                                    />
                                    <AddProductsButton onClick={() => {
                                        setAddProductId(-1)
                                    }
                                    }/>
                                </div>
                                <button onClick={() => changeTab()}
                                        className="flex w-full place-self-center justify-center my-2 rounded-lg bg-tremor-border dark:bg-dark-tremor-border">
                                    <button disabled={activeTab === "list"}
                                        className={`w-1/4 px-4 py-2 rounded-md text-center z-[1] font-semibold uppercase bg-transparent translate-x-1/2 ${activeTab === 'list' ? 'text-white' : ''}`}
                                    >
                                        List
                                    </button>
                                    <button
                                        disabled
                                        // hidden
                                        className={`w-1/2 h-full py-2 rounded-md font-semibold uppercase bg-tremor-brand transition-transform duration-300 text-white ${activeTab === "list"
                                            ? "-translate-x-1/2"
                                            : "translate-x-1/2"
                                        }`}
                                    >
                                    </button>
                                    <button disabled={activeTab === "map"}
                                        className={`w-1/4 px-4 py-2 rounded-md text-center z-[1] font-semibold uppercase bg-transparent -translate-x-1/2 ${activeTab === 'map' ? 'text-white' : ''}`}
                                    >
                                        Map
                                    </button>
                                </button>
                                {/* <div className={`h-full rounded-lg bg-tremor-brand transition-transform duration-300 ${activeTab === "list" ? '-translate-x-1/2' : 'translate-x-1/2'}`}>
                                        <button
                                            // disabled
                                            // hidden
                                            onClick={() => changeTab("list")}
                                            className={`w-1/2 pl-4 z-[2] py-2 rounded-md font-semibold uppercase bg-transparent ${activeTab === "list"
                                            ? " text-white"
                                            : ""
                                            }`}
                                    >
                                        List
                                    </button>
                                    <button
                                        // disabled
                                        // hidden
                                        onClick={() => changeTab("map")}
                                        className={`w-1/2 pr-4 py-2 z-[2] rounded-md font-semibold uppercase bg-transparent ${activeTab === "map"
                                            ? "text-white"
                                            : ""
                                            }`}
                                    >
                                        Map
                                    </button>
                                </div> */}
                                {/* <ToggleButtonGroup
                                        color="primary"
                                        value={activeTab}
                                        exclusive
                                        onChange={handleChange}
                                        aria-label="Tabs"
                                        style={{ width: '100%', marginLeft: '1rem', marginRight: '1rem' }}
                                    >
                                        <ToggleButton
                                            value="list"
                                            style={{
                                                width: '50%',
                                                height: '2.2rem',
                                                fontSize: '1rem',
                                                backgroundColor: activeTab === 'list' ? '#527EBF' : (theme === 'dark' ? '#333' : '#f0f0f0'),
                                                color: activeTab === 'list' ? 'white' : '#527EBF'
                                            }}
                                        >
                                            List
                                        </ToggleButton>
                                        <ToggleButton
                                            value="map"
                                            style={{
                                                width: '50%',
                                                height: '2.2rem',
                                                fontSize: '1rem',
                                                backgroundColor: activeTab === 'map' ? '#527EBF' : (theme === 'dark' ? '#333' : '#f0f0f0'),
                                                color: activeTab === 'map' ? 'white' : '#527EBF'
                                            }}
                                        >
                                            Map
                                        </ToggleButton>
                                    </ToggleButtonGroup> */}
                            </>
                    }

                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'map' && (
                            <div className="fixed inset-x-0 h-full">
                                <PageMap
                                    closeAfter={closeAfter}
                                    filteredVendors={filteredVendors}
                                    selectedMarket={selectedMarket}
                                    setFilteredVendors={setFilteredVendors}
                                    setAddProductId={setAddProductId}
                                    selectedReasons={selectedReasons}
                                    setSelectedReasons={setSelectedReasons}
                                    productsWithoutAlternatives={productsWithoutAlternatives}
                                    setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                    initialVendor={initialSelectedMapVendor}
                                    setInitialVendor={setInitialSelectedMapVendor}
                                    setUserData={setUserdata}
                                    filteredProductsVendors={filteredProductsVendors}
                                />
                            </div>
                        )}
                        {activeTab === 'list' &&
                            <PageShoppingList
                                selectedProducts={selectedProducts}
                                productsList={productsList}
                                setProductsList={setProductsList}
                            filteredVendors={filteredVendors}
                                closeAfter={closeAfter}
                                selectedMarket={selectedMarket}
                                openEditMode={openEditMode}
                                addOrRemoveSelected={addOrRemoveSelected}
                                isEditMode={isEditMode}
                                selectedOrRemoveAllProductsFromVendor={selectedOrRemoveAllProductsFromVendor}
                                filteredProductsVendors={filteredProductsVendors}
                                setFilteredVendors={setFilteredVendors}
                                setAddProductId={setAddProductId}
                                selectedReasons={selectedReasons}
                                setSelectedReasons={setSelectedReasons}
                                productsWithoutAlternatives={productsWithoutAlternatives}
                                setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                changeTab={changeTab}
                                setInitialSelectedMapVendor={setInitialSelectedMapVendor}
                                userdata={userdata}
                                setUserdata={setUserdata}
                            />}
                    </div>
                </div>
            }
        </>
    );

}