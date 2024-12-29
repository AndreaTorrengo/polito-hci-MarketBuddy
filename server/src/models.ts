class Vendor {
    id: number;
    name: string;
    market: string;
    position: string;
    priceMultiplier: number;
    quality_rating: string;
    convenience_rating: string;
    cordiality_rating: string;
    categories: string[];
    badges: string[];
    products: Product[];

    constructor(id: number, name: string, market: string, position: string, quality_rating: string, convenience_rating: string, cordiality_rating: string, priceMultiplier: number, categories: string[], badges: string[], products: Product[]) {
        this.id = id;
        this.name = name;
        this.market = market;
        this.position = position;
        this.quality_rating = quality_rating;
        this.convenience_rating = convenience_rating;
        this.cordiality_rating = cordiality_rating;
        this.priceMultiplier = priceMultiplier;
        this.categories = categories;
        this.badges = badges;
        this.products = products;
    }
}

class Product {
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

export { Vendor, Product };