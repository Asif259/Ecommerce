export interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

export interface Favorites {
  items: FavoriteItem[];
  itemCount: number;
}
