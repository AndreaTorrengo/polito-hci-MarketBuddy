import { Circle, CircleCheckBig, Coins } from 'lucide-react'

export interface ProductItemProps {
    id: number;
    image: string;
    name: string;
    points?: number;
    price: number;
    isSelected?: boolean;
    isEditMode?: boolean;
}

export default function ProductItem({ image, name, points, price, isSelected, isEditMode }: Readonly<ProductItemProps>) {

    return (
        <div className="relative rounded-md drop-shadow-lg aspect-square dark:text-white">

            <div className="absolute left-3 top-[-1rem]">
                {
                    isEditMode &&
                    (isSelected ?
                        <div className="w-8 h-16 flex items-center justify-center translate-x-[-0.8rem]">
                            <CircleCheckBig size={20} color="black"/>
                        </div>
                        :
                        <div
                            className="w-8 h-16 flex items-center justify-center translate-x-[-0.8rem]">
                            <Circle size={20} color="gray"/>
                        </div>
                    )
                }
            </div>

            <div className="w-full h-full transition-all duration-300">
                <img src={image} alt={name + " image"} className="rounded-md aspect-square object-cover" />
                <div className="absolute top-0 right-0 bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle px-1.5 rounded-tr-sm rounded-es-md">
                    {points !== 0 &&
                        <div className="flex flex-row gap-1 items-center text-[var(--buddy-coins)] dark:text-[var(--dark-buddy-coins)]">
                            <p className="m-0 p-0">{points}</p>
                            <Coins size={20} />
                        </div>
                    }
                </div>
                <div
                    className="absolute bottom-0 left-0 w-full h-[55%] bg-gradient-to-t from-[#222222] to-transparent rounded-sm"></div>
                <p className="text-sm absolute w-full m-0 p-0 line-clamp-1 text-center text-white translate-y-[-3em]">
                    {name}
                </p>
                <p className="text-[0.7rem] w-full m-0 p-0 line-clamp-1 text-center text-white translate-y-[-2.1em]">
                    € {price} /kg
                </p>
            </div>
        </div>
    );
}