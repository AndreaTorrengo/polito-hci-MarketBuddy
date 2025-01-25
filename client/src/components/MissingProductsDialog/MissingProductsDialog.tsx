import { Button, Dialog, DialogPanel } from '@tremor/react';
import WarningIcon from '@mui/icons-material/Warning';
import { Vendor, Product, Market } from '../../models';
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MissingProductsDialog.css';

interface MissingProductsDialogProps {
    missingProducts: string[];
    theme: string;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    selectedMarket: Market;
    updateVendorsAndProducts: () => void;
}

const MissingProductsDialog: React.FC<MissingProductsDialogProps> = ({
    missingProducts,
    theme,
    productsList,
    setProductsList,
    selectedMarket,
    updateVendorsAndProducts
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAlternatives, setSelectedAlternatives] = useState<{ [key: string]: Product[] }>({});
    const [randomAlternatives, setRandomAlternatives] = useState<{ [key: string]: Product[] }>({});





    const previousMarketRef = useRef(selectedMarket);

    useEffect(() => {


        if (missingProducts.length > 0) {

            const generateSpecificAlternatives = () => {
                const newSpecificAlternatives: { [key: string]: Product[] } = {};
                missingProducts.forEach((product) => {
                    let alternatives: Product[] = [];
                    if (product === 'Pears' && selectedMarket.name === 'Crocetta Market') {
                        alternatives = [
                            { id: 1, name: 'Kiwi', price: 1.5 },
                            { id: 2, name: "Apples", price: 1.0 }
                        ];
                    } else if (product === "Pears") {
                        alternatives = [{ id: 3, name: "Apples", price: 1.0 }];
                    } else if (product === "Bream") {
                        alternatives = [{ id: 10, name: "Cod", price: 9.5 }];
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
    }, [missingProducts, selectedMarket]);

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

        updateVendorsAndProducts();

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