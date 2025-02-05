import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PageMap from '../PageMap/PageMap';
import { Market, Vendor, Product } from '../../models';
import PageShoppingList from '../PageShoppingList/PageShoppingList';
import MarketSelectorSheet from '../MarketSelectorSheet/MarketSelectorSheet';
import { ButtonBase } from "@mui/material";
import SwitchButton from "../PageVendorProducts/SwitchButton.tsx";
import SignalErrorButton from "../PageVendorProducts/SignalErrorButton.tsx";
import DeleteButton from "../PageVendorProducts/DeleteButton.tsx";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import { TextInput } from "@tremor/react";
import { Circle, CircleCheckBig, Search } from "lucide-react";
import AddProductsButton from "../PageVendorProducts/AddProductsButton.tsx";
import PageAddProducts from "../PageAddProducts/PageAddProducts.tsx";

interface TabsHeroProps {
    theme: string;
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
}

export default function TabsHero({
    theme,
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
    setProductsWithoutAlternatives
}: Readonly<TabsHeroProps>): JSX.Element {
    const [selectedProducts, setSelectedProducts] = useState<Map<number, number[]> | null>(null);
    const [filteredProductsVendors, setFilteredProductsVendors] = useState<Vendor[]>(filteredVendors); //vendors with filtered products
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [addProductId, setAddProductId] = useState<number | null>(null) //the id is -1 in case of add Products from shopping list page or vendorId from vendor Page

    //total number of products
    const totalProducts = filteredVendors.reduce((acc, vendor) => acc + vendor.products.length, 0);

    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') ?? 'list';
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

    // Link vendor position to the map
    const [initialSelectedMapVendor, setInitialSelectedMapVendor] = useState<Vendor | null>(null);

    return (
        <>
            {addProductId != null ?
                <PageAddProducts setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket}
                    actualVends={filteredVendors} allVends={vendors} theme={theme} setAddProductId={setAddProductId} addProductId={addProductId} /> :
                <div className="flex flex-col h-full min-h-0 px-6 py-4">
                    {
                        isEditMode ?
                            <TopBar
                                leftComponent={<ButtonBase className="text-md font-semibold" onClick={exitEditMode}><p
                                    className="m-0 p-0">Cancel</p></ButtonBase>}
                                centerComponent={<h1
                                    className="line-clamp-1 m-0 p-0 text-md font-normal text-center">{selectedProducts ? (countSelectedProducts() + " Selected") : ""}</h1>}
                                rightComponent={
                                    <div className='flex gap-3 items-center'>
                                        {
                                            selectedProducts && countSelectedProducts() === totalProducts ?
                                                <div className="flex items-center justify-center" onClick={
                                                    () => {
                                                        setSelectedProducts(new Map());
                                                    }
                                                }>
                                                    <CircleCheckBig size={20} />
                                                </div>
                                                :
                                                <div
                                                    className="flex items-center justify-center"
                                                    onClick={
                                                        () => {
                                                            selectAllProducts();
                                                        }
                                                    }>
                                                    <Circle size={20} color="gray" />
                                                </div>

                                        }

                                        {selectedProducts && selectedProducts.size > 0 &&
                                            <>
                                                <SwitchButton
                                                    setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                                                    selectedMarket={selectedMarket}
                                                    selectedProducts={selectedProducts}
                                                    setFilteredVendors={setFilteredVendors} theme={theme}
                                                    closeAfter={closeAfter} />
                                                <SignalErrorButton
                                                    selectedMarket={selectedMarket}
                                                    selectedProducts={selectedProducts}
                                                    closeAfter={closeAfter}
                                                    setFilteredVendors={setFilteredVendors} />
                                                <DeleteButton
                                                    selectedMarket={selectedMarket}
                                                    selectedProducts={selectedProducts}
                                                    setFilteredVendors={setFilteredVendors} theme={theme}
                                                    closeAfter={closeAfter} />
                                            </>}

                                    </div>
                                } />
                            :
                            <>
                                <div className='flex justify-between mb-4'>
                                    <h1 className="page-title mr-auto">Shopping</h1>
                                    <MarketSelectorSheet className="!p-0" selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
                                </div>
                                <div className='flex flex-row gap-6'>
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
                                    } />
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
                            <div className="fixed inset-x-0 h-full">
                                <PageMap
                                    theme={theme}
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
                                />
                            </div>
                        )}
                        {activeTab === 'list' &&
                            <PageShoppingList
                                selectedProducts={selectedProducts}
                                productsList={productsList}
                            setProductsList={setProductsList}
                            filteredVendors={filteredVendors}
                                theme={theme}
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
                            changeTab={handleChange}
                            setInitialSelectedMapVendor={setInitialSelectedMapVendor}
                            />}
                    </div>
                </div>
            }
        </>
    );

}