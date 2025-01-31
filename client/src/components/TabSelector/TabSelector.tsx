import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PageMap from '../PageMap/PageMap';
import { Market, Vendor } from '../../models';
import PageShoppingList from '../PageShoppingList/PageShoppingList';
import MarketSelectorSheet from '../MarketSelectorSheet/MarketSelectorSheet';
import { ButtonBase } from "@mui/material";
import SwitchButton from "../PageVendorProducts/SwitchButton.tsx";
import SignalErrorButton from "../PageVendorProducts/SignalErrorButton.tsx";
import DeleteButton from "../PageVendorProducts/DeleteButton.tsx";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import { TextInput } from "@tremor/react";
import SearchIcon from "@mui/icons-material/Search";
import AddProductsButton from "../PageVendorProducts/AddProductsButton.tsx";
import { useNavigate } from "react-router-dom";

interface TabsHeroProps {
    theme: string;
    vendors: Vendor[];
    filteredVendors: Vendor[];
    selectedMarket: Market;
    setSelectedMarket: (selectedMarket: Market) => void;
    missingProducts: string[];
    updateVendorsAndProducts: () => void;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    isFeedbackDialogOpen: string|null;
    setIsFeedbackDialogOpen: React.Dispatch<React.SetStateAction<string|null>>;
}

export default function TabsHero({
    theme,
    vendors,
    filteredVendors,
    selectedMarket,
    setSelectedMarket,
    missingProducts,
    updateVendorsAndProducts,
    productsList,
    setProductsList,
    setFilteredVendors,
    isFeedbackDialogOpen,
    setIsFeedbackDialogOpen,

}: TabsHeroProps): JSX.Element {
    const [selectedProducts, setSelectedProducts] = useState<Map<number, number[]> | null>(null);
    const [filteredProductsVendors, setFilteredProductsVendors] = useState<Vendor[]>(filteredVendors); //vendors with filtered products
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    //total number of products
    const totalProducts = filteredVendors.reduce((acc, vendor) => acc + vendor.products.length, 0);

    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'list';
    });

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newTab: string,
    ) => {
        if (newTab !== null) {
            setActiveTab(newTab);
            localStorage.setItem('activeTab', newTab);
        }
    };

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    //open edit mode when selecting a product
    const openEditMode = (event: React.MouseEvent, vendorId: number, productId: number) => {
        event.preventDefault();
        const newMap = new Map<number, number[]>();
        newMap.set(vendorId, [productId]);
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
                newSelectedProducts.set(vendorId, []);
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

    return (
        <div className="flex flex-col h-full min-h-0">
            {
                isEditMode ?
                    <TopBar
                        leftComponent={<ButtonBase className="text-md font-semibold" onClick={exitEditMode}><p
                            className="m-0 p-0">Cancel</p></ButtonBase>}
                        centerComponent={<h1
                            className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (countSelectedProducts() + " Selected") : ""}</h1>}
                        rightComponent={
                            <>
                                {
                                    selectedProducts && countSelectedProducts() === totalProducts ?
                                        <div className="w-8 h-16 flex items-center justify-center" onClick={
                                            () => {
                                                setSelectedProducts(new Map());
                                            }
                                        }>
                                            <div
                                                className="rounded-full text-green-500 h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                                <svg
                                                    className="h-6 w-6 text-black dark:text-white translate-y-[-0.3em] translate-x-[-0.1em] transition-all duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        :
                                        <div
                                            className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300"
                                            onClick={
                                                () => {
                                                    selectAllProducts();
                                                }
                                            }>
                                            <div
                                                className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                                            </div>
                                        </div>

                                }

                                {selectedProducts && selectedProducts.size > 0 &&
                                    <>
                                        <SwitchButton selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme} closeAfter={closeAfter} />
                                        <SignalErrorButton selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme} closeAfter={closeAfter} />
                                        <DeleteButton isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen} selectedMarket={selectedMarket} selectedProducts={selectedProducts} setFilteredVendors={setFilteredVendors} theme={theme} closeAfter={closeAfter} />
                                    </>}

                            </>
                        }>
                    </TopBar>
                    :
                    <>
                        <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
                        <div className="px-4 flex flex-row items-center gap-2 justify-between">
                            <div className="flex-1">
                                <TextInput
                                    placeholder="Search Products"
                                    id="search"
                                    name="search"
                                    type="search"
                                    className="py-1 ps-4 rounded-full"
                                    icon={SearchIcon}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                            </div>
                            <div onClick={() => {
                                navigate("/addProducts")
                            }
                            }><AddProductsButton></AddProductsButton></div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            marginTop: '0.5rem'
                        }}>
                            <ToggleButtonGroup
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
                            </ToggleButtonGroup>
                        </div>
                    </>
            }

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'map' && (
                    <div className="flex" style={{ width: '100%', height: '100%' }}>
                        <PageMap  isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen} theme={theme} vendors={vendors} filteredVendors={filteredVendors}
                            selectedMarket={selectedMarket} filteredProductsVendors={filteredProductsVendors} setFilteredVendors={setFilteredVendors} />
                    </div>
                )}
                {activeTab === 'list' &&
                    <PageShoppingList
                        isFeedbackDialogOpen={isFeedbackDialogOpen} setIsFeedbackDialogOpen={setIsFeedbackDialogOpen}
                        selectedProducts={selectedProducts} vendors={vendors} productsList={productsList}
                        setProductsList={setProductsList} theme={theme} selectedMarket={selectedMarket}
                        missingProducts={missingProducts}
                        updateVendorsAndProducts={updateVendorsAndProducts} openEditMode={openEditMode}
                        addOrRemoveSelected={addOrRemoveSelected} isEditMode={isEditMode}
                        selectedOrRemoveAllProductsFromVendor={selectedOrRemoveAllProductsFromVendor}
                        filteredProductsVendors={filteredProductsVendors}
                        setFilteredVendors={setFilteredVendors}
                    />}
            </div>
        </div>
    );
}