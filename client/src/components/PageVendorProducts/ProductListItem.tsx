export interface ProductListItemProps {
    id: number;
    image: string;
    name: string;
    price: string;
    editMode?: boolean;
    isSelected?: boolean;
}

export default function ProductListItem({ image, name, price, editMode, isSelected }: ProductListItemProps) {
    return (
        <>
            {editMode &&
                (isSelected ?
                    <div className="w-8 h-16 flex items-center justify-center translate-x-[-0.8rem]">
                        <div
                            className="rounded-full text-green-500 h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300 ">
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
                    <div className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300 translate-x-[-0.8rem]">
                        <div
                            className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                        </div>
                    </div>
                )
            }
            <div
                className="flex flex-row items-center gap-2 w-full p-2.5 rounded-lg bg-white dark:bg-dark-tremor-background drop-shadow-lg overflow-hidden transition-all duration-300">
                <div className="w-16 h-16 transition-all duration-300">
                    <img src={image} alt={name + " image"} className="h-full rounded-md object-cover" />
                </div>
                <div className="flex-1 transition-all duration-300">
                    <p className="p-0 m-0 line-clamp-1">{name}</p>
                </div>
                <div className="transition-all duration-300">
                    <p className="p-0 m-0 line-clamp-1 font-bold">{price}<span className="font-normal">{" €/kg"}</span></p>
                </div>
            </div>
        </>
    );
}