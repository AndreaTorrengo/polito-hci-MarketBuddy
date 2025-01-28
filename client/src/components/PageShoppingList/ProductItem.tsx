import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

export interface ProductItemProps {
    id: number;
    image: string;
    name: string;
    points?: number;
    price: number;
    isSelected?: boolean;
    isEditMode?: boolean;
}

export default function ProductItem({image, name, points, price, isSelected, isEditMode}: ProductItemProps) {

    return (
        <div className="relative rounded-md drop-shadow-lg aspect-square">

            <div className="absolute left-3 top-[-1rem]">
                {
                    isEditMode &&
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
            </div>

            <div className="w-full h-full transition-all duration-300">
                <img src={image} alt={name + " image"} className="rounded-md aspect-square object-cover"/>
                <div className="text-white absolute top-0 right-0 bg-tremor-brand px-1.5 rounded-tr-sm rounded-es-md">
                    {points &&
                        <div className="flex flex-row gap-1 items-center">
                            <p className="m-0 p-0">{points}</p>
                            <EmojiEmotionsIcon fontSize="small"></EmojiEmotionsIcon>
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