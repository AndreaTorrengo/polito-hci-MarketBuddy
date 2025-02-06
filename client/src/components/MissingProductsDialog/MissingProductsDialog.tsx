import { DialogPanel } from '@tremor/react';
import { Dialog } from '../generalPurposeComponents/Dialog';
import { Button } from '../generalPurposeComponents/Button';
import { Vendor, Product, Market } from '../../models';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MissingProductsDialog.css';
import globalContext from '../../Context';
import ProductItem from '../PageShoppingList/ProductItem';
import { ChevronLeft, ChevronRight, TriangleAlert } from 'lucide-react'

interface MissingProductsDialogProps {
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
}

const MissingProductsDialog: React.FC<MissingProductsDialogProps> = ({
    productsList,
    setProductsList,
    selectedMarket,
    setFilteredVendors
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAlternatives, setSelectedAlternatives] = useState<{ [key: string]: Product[] }>({});
    const [randomAlternatives, setRandomAlternatives] = useState<{ [key: string]: Product[] }>({});
    const filteredVendorsKey = `filteredVendors_${selectedMarket.name}`;
    const vendorsKey = `vendors_${selectedMarket.name}`;
    const filteredVendors: Vendor[] = JSON.parse(localStorage.getItem(filteredVendorsKey) ?? '{}');
    const vendors: Vendor[] = JSON.parse(localStorage.getItem(vendorsKey) ?? '{}');

    const missingProductsKey = `missingProducts_${selectedMarket.name}`;
    const missingProducts: string[] = JSON.parse(localStorage.getItem(missingProductsKey) ?? '[]');

    const previousMarketRef = useRef(selectedMarket);

    const showToastMessage = useContext(globalContext)?.showToastMessage;

    useEffect(() => {
        if (missingProducts.length > 0) {
            const generateSpecificAlternatives = () => {
                const newSpecificAlternatives: { [key: string]: Product[] } = {};
                missingProducts.forEach((product) => {
                    let alternatives: Product[] = [];
                    if (product === 'Pears' && selectedMarket.name === 'Crocetta Market') {
                        alternatives = [
                            { id: 1, name: 'Kiwi', price: 1.5, points: undefined, image: "src/assets/products/kiwi.jpg" },
                            { id: 2, name: "Apples", price: 1.0, points: 15, image: "src/assets/products/mele.jpg" }
                        ];
                    } else if (product === "Pears") {
                        alternatives = [{ id: 3, name: "Apples", price: 1.0, points: 15, image: "src/assets/products/mele.jpg" }];
                    } else if (product === "Bream") {
                        alternatives = [{ id: 10, name: "Cod", price: 9.5, points: undefined, image: "src/assets/products/cod.webp" }];
                    } else {
                        alternatives = [];
                    }
                    newSpecificAlternatives[product] = alternatives;
                });
                setRandomAlternatives(newSpecificAlternatives);
            };

            generateSpecificAlternatives();
        }

        if (previousMarketRef.current.name !== selectedMarket.name) {
            setCurrentIndex(0);
        }
        previousMarketRef.current = selectedMarket;
    }, [selectedMarket, isOpen]);

    const handleConfirm = (product: string, selectedAlternatives: Product[]) => {
        const updatedProductList = { ...productsList };
        updatedProductList[selectedMarket.name] = updatedProductList[selectedMarket.name].filter(p => p !== product);

        // Add the selected alternatives to the updated product list
        if (selectedAlternatives) {
            updatedProductList[selectedMarket.name] = [
                ...updatedProductList[selectedMarket.name],
                ...selectedAlternatives.map(alternative => alternative.name)
            ];
        }
        setProductsList(updatedProductList);
        localStorage.setItem('productsList', JSON.stringify(updatedProductList));
        const updatedMissingProducts = missingProducts.filter(p => p !== product);
        localStorage.setItem(missingProductsKey, JSON.stringify(updatedMissingProducts));

        const updatedFilteredVendor: Vendor[] = [...filteredVendors];

        selectedAlternatives.forEach(alternative => {
            const vendor = vendors.find(v => v.products.some((product: Product) => product.name === alternative.name));
            if (vendor) {
                const product = vendor.products.find(p => p.name === alternative.name);
                if (product) {
                    const existingVendor = updatedFilteredVendor.find(v => v.name === vendor.name);
                    if (existingVendor) {
                        if (existingVendor.products.some((p: Product) => p.id === product.id)) return;
                        existingVendor.products.push(product);
                    } else {
                        updatedFilteredVendor.push({
                            ...vendor,
                            products: [product]
                        });
                    }
                }
            }
        });

        localStorage.setItem(filteredVendorsKey, JSON.stringify(updatedFilteredVendor));
        setFilteredVendors(updatedFilteredVendor);


        if (currentIndex === missingProducts.length - 1) {
            setCurrentIndex(0);
        }

        if (selectedAlternatives.length !== 0) {
            showToastMessage && showToastMessage('Product added to shopping list!', 'success');
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedAlternatives({});
    };

    const handleSelectAlternative = (missingProductId: string, alternative: Product) => {
        const updatedAlternatives = { ...selectedAlternatives };

        if (!updatedAlternatives[missingProductId]) {
            updatedAlternatives[missingProductId] = [];
        }

        if (updatedAlternatives[missingProductId].includes(alternative)) {
            updatedAlternatives[missingProductId] = updatedAlternatives[missingProductId].filter(item => item !== alternative);
        } else {
            updatedAlternatives[missingProductId].push(alternative);
        }

        setSelectedAlternatives(updatedAlternatives);
    };

    const handleNext = () => {
        if (missingProducts.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % missingProducts.length);
        }
    };

    const handlePrevious = () => {
        if (missingProducts.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + missingProducts.length) % missingProducts.length);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
        trackMouse: true
    });

    return (
        <>
            {missingProducts.length > 0 && (
                <Button
                    className="my-1 py-2 px-5 text-sm bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle "
                    color='danger'
                    // variant='contained'
                    onClick={() => setIsOpen(true)}
                >
                    <TriangleAlert />
                    <span>Some products are missing at this market!</span>
                </Button>
            )}
            {missingProducts.length > 0 && (<Dialog open={isOpen} static={true} onClose={handleClose} className="max-h-screen overflow-y-auto z-40">

                <DialogPanel {...handlers} className="dialog-panel max-h-screen overflow-y-auto">

                    <>

                        <h2 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Missing Products</h2>
                        <span>Not all products from your list are available at this market</span>
                        <ul>
                            <li className="mt-2">
                                <span>{"Select alternative/s for "}<strong className="alternative">{missingProducts[currentIndex]}</strong></span>
                                <div className="flex justify-center mt-4">

                                    <div className={`flex justify-center gap-4 grid-cols-${randomAlternatives[missingProducts[currentIndex]]?.length >= 4 ? '4' : randomAlternatives[missingProducts[currentIndex]]?.length}`}>
                                        {Array.isArray(randomAlternatives[missingProducts[currentIndex]]) && randomAlternatives[missingProducts[currentIndex]].length > 0 ? (
                                            randomAlternatives[missingProducts[currentIndex]].map((alternative, altIndex) => (
                                                <div key={alternative.id}>
                                                    <button onClick={() => handleSelectAlternative(missingProducts[currentIndex], alternative)} style={{ width: '120px', height: '120px' }}>
                                                        <ProductItem
                                                            key={alternative.id}
                                                            {...alternative}
                                                            isSelected={selectedAlternatives[missingProducts[currentIndex]]?.includes(alternative) || false}
                                                            isEditMode={true}
                                                        />
                                                    </button>
                                                    {missingProducts.length > 1 && (<div className='absolute top-[10px] right-[10px] bg-transparent border-none pointer-events-none text-[#333333] dark:text-[#EEEEEE]'
                                                        style={{ fontSize: '1rem' }}
                                                    >
                                                        {currentIndex + 1}/{missingProducts.length}
                                                    </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="col-span-full text-center" style={{ width: '260px', height: '138px' }}>
                                                    <div className="text-center" style={{ width: '260px', height: '80px', marginTop: '2rem' }}>Sorry, but there don't seem to be any alternatives for this product at the market.</div>
                                                </div>
                                                    {missingProducts.length > 1 && (<div className='absolute top-[10px] right-[10px] bg-transparent border-none pointer-events-none text-[#333333] dark:text-[#EEEEEE]'
                                                        style={{ fontSize: '1rem' }}
                                                >
                                                    {currentIndex + 1}/{missingProducts.length}
                                                </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                </div>
                                {missingProducts.length > 1 && (<button onClick={handlePrevious} className="p-2 absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <ChevronLeft />
                                </button>)}
                                <div className="flex mt-4 justify-end">
                                    {Array.isArray(randomAlternatives[missingProducts[currentIndex]]) && randomAlternatives[missingProducts[currentIndex]].length > 0 ? (
                                        <div className="flex mt-4 space-x-3">
                                            <Button
                                                onClick={() => { handleConfirm(missingProducts[currentIndex], []) }}
                                                color='primary'
                                                variant='outlined'
                                            >
                                                Do Nothing
                                            </Button>
                                            <Button
                                                onClick={() => { handleConfirm(missingProducts[currentIndex], selectedAlternatives[missingProducts[currentIndex]] || []) }}
                                                disabled={!selectedAlternatives[missingProducts[currentIndex]] || selectedAlternatives[missingProducts[currentIndex]].length === 0}
                                                variant='contained'
                                                color='primary'
                                            >
                                                Add To List
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                                onClick={() => { handleConfirm(missingProducts[currentIndex], []) }}
                                                variant='outlined'
                                                color='primary'
                                        >
                                            Got it
                                        </Button>
                                    )}
                                    {missingProducts.length > 1 && (<button onClick={handleNext} className="p-2 absolute right-0 top-1/2 transform -translate-y-1/2">
                                        <ChevronRight />
                                    </button>)}
                                </div>

                            </li>

                        </ul>


                    </>


                    {missingProducts.length > 1 && (
                        <div className="flex justify-center mt-4">
                            {missingProducts.map((_, index) => (
                                <span
                                    key={index}
                                    className={`mx-1 h-2 w-2 rounded-full ${index === currentIndex ? 'bg-tremor-brand' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </DialogPanel>

                {/* {confirmationMessage !== 'no option' && (
                    <div className="fixed inset-x-0 top-0 flex items-center justify-center z-50 mt-60">
                        <div className="bg-green-500 p-4 text-white rounded-lg shadow-lg">
                            {confirmationMessage}
                        </div>
                    </div>
                )} */}
            </Dialog>
            )}
        </>
    );
};

export default MissingProductsDialog;