import { create } from 'zustand';

export type CartItem = {
    id: string | number;
    title: string;
    date: string;
    price: number;
    guests: number;
    hotelOption?: string;
};

interface CartState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    addToCart: (item) =>
        set((state) => ({
            cart: [...state.cart, item],
        })),
}));
