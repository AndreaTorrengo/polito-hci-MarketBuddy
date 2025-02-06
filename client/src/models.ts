class Vendor {
    id: number;
    name: string;
    market: string;
    position: number[];
    priceMultiplier: number;
    quality_rating: string;
    convenience_rating: string;
    cordiality_rating: string;
    categories: string[];
    badges: string[];
    products: Product[];

    constructor(id: number, name: string, market: string, position: number[], quality_rating: string, convenience_rating: string, cordiality_rating: string, priceMultiplier: number, categories: string[], badges: string[], products: Product[]) {
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
    points?: number;
    image: string;

    constructor(id: number, name: string, price: number, points: number, image: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.points = points;
        this.image = image;

    }
}


class Market {
    id: number;
    name: string;
    position: number[];
    address: string;
    distance: number;

    constructor(id: number, name: string, position: number[], address: string, distance: number) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.address = address;
        this.distance = distance;
    }
}

class Reward {
    id: number;
    description: string;
    cost: number;
    icon: string;
    redeemed?: boolean;

    constructor(id: number, description: string, cost: number, icon: string, redeemed: boolean = false) {
        this.id = id;
        this.description = description;
        this.cost = cost;
        this.icon = icon;
        this.redeemed = redeemed;
    }
}

interface Quest {
    id: number;
    coins: number;
    exp: number;
    title: string;
    description: string;
    progress: string;
    completed: boolean;
}


export { Vendor, Product, Reward, Market, Quest };
