export interface ProductItemProps {
    id: number;
    image: string;
    name: string;
    points?: number;
    price: string;
}

export default function ProductItem({ image, name, points, price }: ProductItemProps) {

    return (
        <div className="relative rounded-md drop-shadow-lg aspect-square">
            <div className="w-full h-full transition-all duration-300">
                <img src={image} alt={name + " image"} className="rounded-md aspect-square object-cover" />
                <div className="text-white absolute top-0 right-0 bg-tremor-brand px-2 rounded-tr-sm rounded-es-md">
                    {points}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[55%] bg-gradient-to-t from-[#222222] to-transparent rounded-sm"></div>
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