interface VendorCategoryListProps {
    categories: string[];
}

export default function VendorCategoryList({ categories }: VendorCategoryListProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {categories.map((category, index) => (
                <span key={index} className="px-2 py-1.5 bg-white dark:bg-dark-tremor-background rounded-full border border-1 border-[#ddeeee] dark:border-[#444444]">
                    {category}
                </span>
            ))}
        </div>
    );
}