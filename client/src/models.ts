class Vendor {
    id: number;
    name: string;
    market: string;
    position: string;
    priceMultiplier: number;
    quality_rating: number;
    price_rating: number;
    cordiality_rating: number;
    badges: string[];
    products: Product[];

    constructor(id: number, name: string, market: string, position: string, quality_rating: number, price_rating: number, cordiality_rating: number, priceMultiplier: number, badges: string[], products: Product[]) {
        this.id = id;
        this.name = name;
        this.market = market;
        this.position = position;
        this.quality_rating = quality_rating;
        this.price_rating = price_rating;
        this.cordiality_rating = cordiality_rating;
        this.priceMultiplier = priceMultiplier;
        this.badges = badges;
        this.products = products;
    }
}

class Product {
    id: number;
    name: string;
    description: string;
    price: number;

    constructor(id: number, name: string, description: string, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }
}

export { Vendor, Product };