export interface ProductListItemProps {
    image: string;
    name: string;
    price: string;
}

export default function ProductListItem({image, name, price}: ProductListItemProps) {
    return (
        <div className="flex flex-row items-center gap-2 w-full p-2.5 rounded-lg bg-white dark:bg-dark-tremor-background drop-shadow-lg">
            <div className="w-16 h-16">
                <img src={image} alt={name + " image"} className="h-full rounded-md object-cover"/>
            </div>
            <div className="flex-1">
                <p className="p-0 m-0 line-clamp-1">{name}</p>
            </div>
            <div className="">
                <p className="p-0 m-0 line-clamp-1 font-bold">{price}<span className="font-normal">{" €/kg"}</span></p>
            </div>
        </div>
    );
}