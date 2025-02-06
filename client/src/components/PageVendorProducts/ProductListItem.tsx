import { Circle, CircleCheckBig, Coins } from "lucide-react";

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
                    <CircleCheckBig size={20} />
                </div>
                :
                <div
                    className="w-8 h-16 flex items-center justify-center translate-x-[-0.8rem]">
                    <Circle size={20} color="gray" />
                </div>
                )
            }
            <div
                className="flex flex-row bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle items-center gap-2 w-full p-2.5 rounded-lg drop-shadow-lg overflow-hidden transition-all duration-300">
                <div className="w-16 h-16 transition-all duration-300">
                    <img src={image} alt={name + " image"} className="h-full rounded-md aspect-square object-cover" />
                    <div
                        className="absolute top-0 right-0">
                        {points &&
                            <div className="flex flex-row gap-1 items-center bg-tremor-background dark:bg-dark-tremor-background px-1.5 py-1 rounded-tr-sm rounded-es-md text-[var(--buddy-coins)] dark:text-[var(--dark-buddy-coins)]">
                                <p className="m-0 p-0">{points}</p>
                                <Coins size={20} />
                                {/* <EmojiEmotionsIcon ></EmojiEmotionsIcon> */}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex-1 transition-all duration-300">
                        <p className="p-0 m-0 line-clamp-1 text-lg">{name}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                        {showPrice &&
                            <div className="transition-all duration-300">
                                <p className="p-0 m-0 line-clamp-1 font-semibold">{price}<span
                                    className="font-normal text-lg">{" €/kg"}</span></p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}