import {useParams} from "react-router-dom";
import TopBar from "../generalPurposeComponents/TopBar.tsx";
import VendorCategoryList from "./VendorCategoryList.tsx";
import {useState} from "react";
import AddProductButton from "./AddProductButton.tsx";
import ProductListItem, {ProductListItemProps} from "./ProductListItem.tsx";
import QRButton from "./QRButton.tsx";
import {Sheet} from 'react-modal-sheet';
import VendorBadges from "./VendorBadges.tsx";

export default function PageVendorProducts() {
    const {vendorId} = useParams<{ vendorId: string }>();
    const [categories, setCategories] = useState<string[]>([
        "Category 1",
        "Category 2",
        "Category 3",
        "Category 4",
        "Category 5"
    ]);

    const [products, setProducts] = useState<ProductListItemProps[]>([
        {
            name: "Product 1",
            price: "2,00",
            image: "https://www.ortofruttafoglia.it/wp-content/uploads/2021/11/banana-chiquita.jpg"
        },
        {
            name: "Product 2",
            price: "4,00",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToroQiAMxPnyX-gVi9xtNkh8liffQKdC_6ZQ&s"
        },
        {
            name: "Product 3",
            price: "3,20",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx2txlL9JImnHCk1v30GWPjrgxHri5I0ig4g&s"
        },
        {
            name: "Product 4",
            price: "5,10",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwGRr6MtCnhQa7yyn7X7NN_FEAAOwJDW2fQA&s"
        },
        {
            name: "Product 5",
            price: "7,40",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sTbc5y-hV5F4iPZQ77-NXhfRXqphmjEpyw&s"
        },
        {
            name: "Product 1",
            price: "2,00",
            image: "https://www.ortofruttafoglia.it/wp-content/uploads/2021/11/banana-chiquita.jpg"
        },
        {
            name: "Product 2",
            price: "4,00",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToroQiAMxPnyX-gVi9xtNkh8liffQKdC_6ZQ&s"
        },
        {
            name: "Product 3",
            price: "3,20",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx2txlL9JImnHCk1v30GWPjrgxHri5I0ig4g&s"
        },
        {
            name: "Product 4",
            price: "5,10",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwGRr6MtCnhQa7yyn7X7NN_FEAAOwJDW2fQA&s"
        },
        {
            name: "Product 5",
            price: "7,40",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3sTbc5y-hV5F4iPZQ77-NXhfRXqphmjEpyw&s"
        }
    ]);

    const [isOpen, setOpen] = useState(true);

    return (
        <Sheet isOpen={isOpen} onClose={() => setOpen(false)} detent='content-height' rootId="root">
            <Sheet.Container>
                <Sheet.Header className="bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle rounded-lg">
                </Sheet.Header>
                <Sheet.Content> {
                    <div className="h-full overflow-y-auto">
                        {/* TopBar */}
                        <TopBar
                            centerComponent={<h1 className="line-clamp-1 m-0 p-0 text-2xl titleFont font-bold">Name of the vendor check
                                if the name
                                is too much long</h1>}
                            rightComponent={<QRButton/>}>
                        </TopBar>
                        <div
                            className="w-full h-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle px-6 pt-[3.45em] flex flex-col gap-4">
                            {/* Vendor's Categories */}
                            <div className="w-full">
                                <VendorCategoryList categories={categories}/>
                            </div>

                            <div className="w-full">
                                <VendorBadges market="Crocetta Market"/>
                            </div>

                            <div className="w-full flex-1">
                                {/* Product list top bar */}
                                <div className="w-full flex flex-row justify-between items-center">
                                    <p className="m-0 p-0">Your planned purchases</p>
                                    <AddProductButton/>
                                </div>
                                {/* Product list */}
                                <div className="w-full flex flex-col gap-3 mt-4 pb-[4rem]">
                                    {products.map((product, index) => (
                                        <ProductListItem key={index} {...product}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                }</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setOpen(false)}/>
        </Sheet>
    );
}
