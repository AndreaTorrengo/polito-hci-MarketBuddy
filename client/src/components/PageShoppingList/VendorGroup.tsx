import ProductItem, {ProductItemProps} from "./ProductItem";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import {ButtonBase} from "@mui/material";
import {Vendor} from "../../models";

export interface VendorGroupProps {
    id: number;
    vendor: Vendor;
    products: ProductItemProps[];
    setVendorPageOpened: (value: boolean) => void;
    setSelectedVendor: () => void;
    openEditMode: (event: React.MouseEvent, vendorId: number, productId: number) => void;
    addOrRemoveSelected: (vendorId: number, productId: number) => void;
    selectedProducts: number[];
    isEditMode: boolean;
}

export default function VendorGroup({
                                        products,
                                        vendor,
                                        setVendorPageOpened,
                                        setSelectedVendor,
                                        openEditMode,
                                        addOrRemoveSelected,
                                        selectedProducts,
                                        isEditMode
                                    }: VendorGroupProps) {

    return (
        <div className="px-4">
            <div className="flex flex-row gap-2 pb-2 items-center justify-between" onClick={() => {
                setSelectedVendor();
                setVendorPageOpened(true)
            }}>
                <p className="m-0 p-0 titleFont font-bold text-xl max-w-[50%] min-w-[30%] line-clamp-1">
                    {vendor.name}
                </p>
                <div className="overflow-x-auto min-w-[50%]">
                    <div className="flex flex-col w-full gap-6">
                        <div className='flex flex-row items-center justify-around'>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <WorkspacePremiumIcon sx={{color: "#4b72a6"}}/>
                                <p className="m-0 p-0 font-bold">{vendor.quality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <SentimentSatisfiedAltIcon sx={{color: "#e3c144"}}/>
                                <p className="m-0 p-0 font-bold">{vendor.cordiality_rating}</p>
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center" onClick={() => {
                            }}>
                                <SavingsIcon sx={{color: "#52a36a"}}/>
                                <p className="m-0 p-0 font-bold">{vendor.convenience_rating}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full pb-2 overflow-x-auto">
                <div className="flex flex-row gap-1">
                    {vendor.categories?.map((category, index) => (
                        /* <span key={index} className="px-1.5 py-1.5 bg-white dark:bg-dark-tremor-background rounded-full border border-1 border-[#ddeeee] dark:border-[#444444] text-sm"> */
                        <p key={index}
                           className="whitespace-nowrap px-1.5 py-1.5 bg-white dark:bg-dark-tremor-background rounded-full text-sm">
                            {category}
                        </p>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((product) => (
                    <ButtonBase key={product.id} component="div"
                                onContextMenu={(e) => {
                                    openEditMode(e, vendor.id, product.id);
                                }}
                                onClick={() => {
                                    addOrRemoveSelected(vendor.id, product.id);
                                }}
                    >
                        <ProductItem key={product.id} {...product}
                                     isSelected={selectedProducts.includes(product.id) || false}
                                     isEditMode={isEditMode}
                        />
                    </ButtonBase>
                ))}
            </div>
        </div>
    );
}