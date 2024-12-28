interface VendorCategoryListProps {
    categories: string[];
}

export default function VendorCategoryList({ categories }: VendorCategoryListProps) {
    return (
        <div className="flex flex-wrap gap-1">
            {categories.map((category, index) => (
                <span key={index} className="px-1.5 py-1.5 bg-white dark:bg-dark-tremor-background rounded-full border border-1 border-[#ddeeee] dark:border-[#444444] text-sm">
                    {category}
                </span>
            ))}
        </div>
    );
}