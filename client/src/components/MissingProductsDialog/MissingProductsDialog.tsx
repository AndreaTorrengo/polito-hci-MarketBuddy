import { Button, Dialog, DialogPanel } from '@tremor/react';
import { Vendor, Product } from '../../models';
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';

interface MissingProductsDialogProps {
    filteredVendors: Vendor[];
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setMissingProducts: React.Dispatch<React.SetStateAction<string[]>>;
    missingProducts: string[];
    theme: string;
}

const MissingProductsDialog: React.FC<MissingProductsDialogProps> = ({ setMissingProducts, missingProducts, filteredVendors, setFilteredVendors, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAlternatives, setSelectedAlternatives] = useState<{ [key: string]: string[] }>({});
    const [randomAlternatives, setRandomAlternatives] = useState<{ [key: string]: string[] }>({});
    const hasGeneratedAlternatives = useRef(false);

    const alternatives = ["Alternative 1", "Alternative 2", "Alternative 3", "Alternative 4", "Alternative 5"];

    useEffect(() => {
        if (!hasGeneratedAlternatives.current && missingProducts.length > 0) {


            const shuffleArray = (array: string[]) => {
                return array.sort(() => 0.5 - Math.random());
            };

            const selectRandomAlternatives = (array: string[], count: number) => {
                return shuffleArray(array).slice(0, count);
            };

            const generateRandomAlternatives = () => {
                const newRandomAlternatives: { [key: string]: string[] } = {};
                missingProducts.forEach((product) => {
                    newRandomAlternatives[product] = selectRandomAlternatives(alternatives, Math.floor(Math.random() * alternatives.length) + 1);
                });
                setRandomAlternatives(newRandomAlternatives);
            };

            generateRandomAlternatives();
            hasGeneratedAlternatives.current = true;
        }


    }, [missingProducts]);

    const handleConfirm = (product: string, selectedAlternatives: string[]) => {
        const updatedFiltered = [...filteredVendors];
        const remainingMissingProducts = missingProducts.filter((p) => p !== product);

        // Create a new vendor with all alternatives as products
        const newVendor = {
            id: updatedFiltered.length + 1,
            name: `SampleVendor#${updatedFiltered.length + 1}`,
            products: selectedAlternatives.map((alternative, index): Product => ({
                id: updatedFiltered.length + 1 + index,
                name: alternative,
                price: 0
            })),
            position: '0,0',
            market: 'Porta Palazzo',
            priceMultiplier: 1,
            quality_rating: 0,
            price_rating: 0,
            cordiality_rating: 0,
            categories: [],
            badges: []
        };

        updatedFiltered.push(newVendor);

        setFilteredVendors(updatedFiltered);
        setMissingProducts(remainingMissingProducts); // Update missing products with the remaining ones
        console.log("updated ", updatedFiltered);

        // Reset to the first alternative if this was the last one
        if (currentIndex === missingProducts.length - 1) {
            setCurrentIndex(0);
        }

        // Show confirmation popup
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 1500);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelectAlternative = (product: string, alternative: string) => {
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
                    <Button className="mx-auto block" onClick={() => setIsOpen(true)}>Some products require your attention!</Button>
                </div>
            )}

            <Dialog open={isOpen} static={true} onClose={handleClose}>
                <DialogPanel {...handlers} className="max-h-screen overflow-y-auto">

                    {missingProducts.length > 0 ? (
                        <>
                            <h2 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Missing Products</h2>
                            <span>Not all products from your list are available at the market</span>
                            <ul>
                                <li className="mt-2">
                                    <span>{"Select alternative/s for "}<strong className="text-black">{missingProducts[currentIndex]}</strong></span>
                                    <div className="flex justify-center mt-4">
                                        <div className={`flex justify-center grid gap-4 ${randomAlternatives[missingProducts[currentIndex]]?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                            {randomAlternatives[missingProducts[currentIndex]]?.map((alternative, altIndex) => (
                                                <div
                                                    key={altIndex}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.25rem 1rem',
                                                        cursor: 'pointer',
                                                        borderRadius: '0.5rem',
                                                        textAlign: 'center',
                                                        backgroundColor: selectedAlternatives[missingProducts[currentIndex]]?.includes(alternative) ? '#3b82f6' : '#d1d5db',
                                                        color: selectedAlternatives[missingProducts[currentIndex]]?.includes(alternative) ? '#ffffff' : '#000000',
                                                        margin: '0 auto'
                                                    }}
                                                    onClick={() => handleSelectAlternative(missingProducts[currentIndex], alternative)}
                                                >
                                                    {alternative}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={() => handleConfirm(missingProducts[currentIndex], selectedAlternatives[missingProducts[currentIndex]] || [])}
                                            disabled={!selectedAlternatives[missingProducts[currentIndex]] || selectedAlternatives[missingProducts[currentIndex]].length === 0}
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
                    <div className="fixed top-40 transform  z-50">
                        <div className="bg-green-500 p-2 text-white rounded">
                            Alternatives added successfully!
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default MissingProductsDialog;