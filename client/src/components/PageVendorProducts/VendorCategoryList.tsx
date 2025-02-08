interface VendorCategoryListProps {
    categories: string[];
    page: string;
}

export default function VendorCategoryList({ categories, page }: VendorCategoryListProps) {
    return (
        <div className="flex gap-1">
            {categories.map((category, index) => (
                /* <span key={index} className="px-1.5 py-1.5 bg-white dark:bg-dark-tremor-background rounded-full border border-1 border-[#ddeeee] dark:border-[#444444] text-sm"> */
                <span key={index} className={`px-2 py-1 rounded-full text-sm ${page === 'list' ? 'bg-tremor-background dark:bg-dark-tremor-background-muted' : 'bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle'}`}>
                    {category}
                </span>
            ))}
        </div>
    );
}