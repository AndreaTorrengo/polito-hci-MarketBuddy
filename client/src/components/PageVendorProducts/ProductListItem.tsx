import { Coins } from "lucide-react";

export interface ProductListItemProps {
    id: number;
    image: string;
    name: string;
    price: number;
    points?: number;
    editMode?: boolean;
    isSelected?: boolean;
    showPrice: boolean;
}

export default function ProductListItem({
                                            image,
                                            name,
                                            price,
                                            points,
                                            editMode,
                                            isSelected,
                                            showPrice
                                        }: ProductListItemProps) {
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
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                        :
                        <div
                            className="w-8 h-16 flex items-center justify-center animate-fade transition-all duration-300 translate-x-[-0.8rem]">
                            <div
                                className="rounded-full bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle h-5 w-5 border-2 border-[#bbbbbb] transition-all duration-300">
                            </div>
                        </div>
                )
            }
            <div
                className="flex flex-row bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle items-center gap-2 w-full p-2.5 rounded-lg drop-shadow-lg overflow-hidden transition-all duration-300">
                <div className="w-16 h-16 transition-all duration-300">
                    <img src={image} alt={name + " image"} className="h-full rounded-md aspect-square object-cover"/>
                    <div
                        className="absolute top-0 right-0 px-1.5 py-1 rounded-tl-sm rounded-ee-md">
                        {points &&
                            <div className="flex flex-row gap-1 items-center">
                                <p className="m-0 p-0">{points}</p>
                                <Coins size={20} color="var(--buddy-coins)" />
                                {/* <EmojiEmotionsIcon ></EmojiEmotionsIcon> */}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex-1 transition-all duration-300">
                        <p className="p-0 m-0 line-clamp-1">{name}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                        {showPrice &&
                            <div className="transition-all duration-300">
                                <p className="p-0 m-0 line-clamp-1 font-semibold">{price}<span
                                    className="font-normal">{" €/kg"}</span></p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}