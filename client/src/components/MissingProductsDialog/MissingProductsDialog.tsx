import { Button, Dialog, DialogPanel } from '@tremor/react';
import WarningIcon from '@mui/icons-material/Warning';
import { Vendor, Product, Market } from '../../models';
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MissingProductsDialog.css';

interface MissingProductsDialogProps {
    filteredVendors: Vendor[];
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setMissingProducts: React.Dispatch<React.SetStateAction<string[]>>;
    missingProducts: string[];
    theme: string;
    sortByQuality: boolean;
    sortByConvenience: boolean;
    sortByCordiality: boolean;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    selectedMarket: Market;
    setSelectedMarket: (market: Market) => void;
}

const MissingProductsDialog: React.FC<MissingProductsDialogProps> = ({
    setMissingProducts,
    missingProducts,
    filteredVendors,
    setFilteredVendors,
    theme,
    sortByConvenience,
    sortByCordiality,
    sortByQuality,
    productsList,
    setProductsList,
    selectedMarket,
    setSelectedMarket
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAlternatives, setSelectedAlternatives] = useState<{ [key: string]: Product[] }>({});
    const [randomAlternatives, setRandomAlternatives] = useState<{ [key: string]: Product[] }>({});


    const alternatives: Product[] = [
        { id: 1, name: "Alternative 1", price: 1.2 },
        { id: 2, name: "Alternative 2", price: 2.3 },
        { id: 3, name: "Alternative 3", price: 3.4 },
        { id: 4, name: "Alternative 4", price: 4.5 },
        { id: 5, name: "Alternative 5", price: 5.1 }
    ];


    const previousMarketRef = useRef(selectedMarket);

    useEffect(() => {
        const storedMissingProducts = localStorage.getItem(`missingProducts_${selectedMarket.name}`);
        if (storedMissingProducts) {
            const parsedProducts: string[] = JSON.parse(storedMissingProducts);
            if (parsedProducts.length && JSON.stringify(parsedProducts) !== JSON.stringify(missingProducts)) {
                setMissingProducts(parsedProducts);
            }
        }

        if (missingProducts.length > 0) {
            console.log('alternatives', missingProducts);

            const shuffleArray = (array: Product[]) => array.sort(() => 0.5 - Math.random());

            const selectRandomAlternatives = (array: Product[], count: number) => shuffleArray(array).slice(0, count);

            const generateRandomAlternatives = () => {
                const newRandomAlternatives: { [key: string]: Product[] } = {};
                missingProducts.forEach((product) => {
                    const storedAlternatives = localStorage.getItem(`alternatives_${selectedMarket.name}_${product}`);
                    if (storedAlternatives) {
                        newRandomAlternatives[product] = JSON.parse(storedAlternatives);
                    } else {
                        const maxAlternatives = Math.min(alternatives.length, 3);
                        const selectedAlternatives = selectRandomAlternatives(alternatives, Math.floor(Math.random() * maxAlternatives) + 1);
                        newRandomAlternatives[product] = selectedAlternatives;
                        localStorage.setItem(`alternatives_${selectedMarket.name}_${product}`, JSON.stringify(selectedAlternatives));
                    }
                });
                setRandomAlternatives(newRandomAlternatives);
            };

            generateRandomAlternatives();
        }

        if (previousMarketRef.current.name !== selectedMarket.name) {
            setCurrentIndex(0);
        }
        previousMarketRef.current = selectedMarket;
    }, [missingProducts, selectedMarket]);

    const handleConfirm = (product: string, selectedAlternatives: Product[]) => {
        const updatedFiltered: Vendor[] = [...filteredVendors];
        const remainingMissingProducts = missingProducts.filter((p) => p !== product);
        const randomOffset = () => (Math.random() * 0.0004 - 0.0002).toFixed(2);
        const newPosition = `${selectedMarket.position[0] + parseFloat(randomOffset())},${selectedMarket.position[1] + parseFloat(randomOffset())}`;
        const getRandomRating = (highRating: boolean) => highRating ? Math.floor(Math.random() * 11) + 90 : Math.floor(Math.random() * 31) + 70;

        const newVendor = new Vendor(
            updatedFiltered.length + 1,
            `SampleVendor#${updatedFiltered.length + 1}`,
            selectedMarket.name,
            newPosition,
            getRandomRating(sortByQuality) + "%",
            getRandomRating(sortByConvenience) + "%",
            getRandomRating(sortByCordiality) + "%",
            1,
            [],
            [],
            selectedAlternatives.map(alternative => new Product(alternative.id, alternative.name, alternative.price)),
        );

        updatedFiltered.push(newVendor);
        console.log(updatedFiltered);

        setFilteredVendors(updatedFiltered);
        setMissingProducts(remainingMissingProducts);
        localStorage.setItem(`missingProducts_${selectedMarket.name}`, JSON.stringify(remainingMissingProducts));
        localStorage.setItem(`filteredVendors_${selectedMarket.name}`, JSON.stringify(updatedFiltered));

        const updatedProductList = { ...productsList };
        updatedProductList[selectedMarket.name] = updatedProductList[selectedMarket.name].filter(p => p !== product);
        setProductsList(updatedProductList);
        localStorage.setItem('productsList', JSON.stringify(updatedProductList));

        if (currentIndex === missingProducts.length - 1) {
            setCurrentIndex(0);
        }

        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 900);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelectAlternative = (product: string, alternative: Product) => {
        setSelectedAlternatives((prev) => {
            const currentAlternatives = prev[product] || [];
            if (currentAlternatives.includes(alternative)) {
                return {
                    ...prev,
                    [product]: currentAlternatives.filter((alt) => alt !== alternative),
                };
            } else {
                return {
                    ...prev,
                    [product]: [...currentAlternatives, alternative],
                };
            }
        });
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
                <div>
                    <Button
                        className="mx-auto block alert-button"
                        onClick={() => setIsOpen(true)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <WarningIcon style={{ color: '#e34138' }} />
                            <span>Some products require your attention!</span>
                        </div>
                    </Button>
                </div>
            )}
            <Dialog open={isOpen} static={true} onClose={handleClose} className={`max-h-screen overflow-y-auto ${theme === 'dark' ? 'dark' : ''}`}>
                <DialogPanel {...handlers} className="dialog-panel max-h-screen overflow-y-auto">
                    {missingProducts.length > 0 ? (
                        <>
                            <h2 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Missing Products</h2>
                            <span>Not all products from your list are available at this market</span>
                            <ul>
                                <li className="mt-2">
                                    <span>{"Select alternative/s for "}<strong className="alternative">{missingProducts[currentIndex]}</strong></span>
                                    <div className="flex justify-center mt-4">
                                        <div className={`flex justify-center grid gap-4 ${randomAlternatives[missingProducts[currentIndex]]?.length === 1 ? 'grid-cols-1' : randomAlternatives[missingProducts[currentIndex]]?.length === 2 ? 'grid-cols-2' : randomAlternatives[missingProducts[currentIndex]]?.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                            {randomAlternatives[missingProducts[currentIndex]]?.map((alternative, altIndex) => (
                                                <Button
                                                    className="alternative-button"
                                                    key={altIndex}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.25rem 1rem',
                                                        cursor: 'pointer',
                                                        borderRadius: '0.5rem',
                                                        border: 'none',
                                                        textAlign: 'center',
                                                        color: selectedAlternatives[missingProducts[currentIndex]]?.includes(alternative) ? '#fff' : (theme === 'dark' ? '#000' : '#000'),
                                                        backgroundColor: selectedAlternatives[missingProducts[currentIndex]]?.includes(alternative) ? (theme === 'dark' ? '#3b82f6' : '#3b82f6') : (theme === 'dark' ? '#a0aec0' : '#e5e7eb'),
                                                        margin: '0 auto'
                                                    }}
                                                    onClick={() => handleSelectAlternative(missingProducts[currentIndex], alternative)}
                                                >
                                                    <div>{alternative.name}</div>
                                                    <div>{alternative.price} €/kg</div>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={() => handleConfirm(missingProducts[currentIndex], selectedAlternatives[missingProducts[currentIndex]] || [])}
                                            disabled={!selectedAlternatives[missingProducts[currentIndex]] || selectedAlternatives[missingProducts[currentIndex]].length === 0}
                                            style={{ color: '#fff', }}
                                        >
                                            Add to Shopping List
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <h2 className="text-lg font-semibold text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">No more missing products</h2>
                    )}
                    {missingProducts.length > 0 && (
                        <div className="flex justify-center mt-4">
                            {missingProducts.map((_, index) => (
                                <span
                                    key={index}
                                    className={`mx-1 h-2 w-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </DialogPanel>
                {showConfirmation && (
                    <div className="fixed inset-x-0 bottom-0 flex items-center justify-center z-50 mb-40">
                        <div className="bg-green-500 p-4 text-white rounded-lg shadow-lg">
                            Alternatives added successfully!
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default MissingProductsDialog;