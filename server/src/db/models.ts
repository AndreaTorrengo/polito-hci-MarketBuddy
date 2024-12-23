class Vendor {
    id: number;
    name: string;
    market: string;
    position: string;
    priceMultiplier: number;
    badges: string[];
    products: Product[];

    constructor(id: number, name: string, market: string, position: string, priceMultiplier: number, badges: string[], products: Product[]) {
        this.id = id;
        this.name = name;
        this.market = market;
        this.position = position;
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