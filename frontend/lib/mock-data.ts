export interface Trip {
    id: string;
    title: string;
    description: string;
    price: number; // Base price or fixed price
    image: string;
    is_group_trip: boolean;
    fixed_date?: string; // YYYY-MM-DD
    pricing_options?: {
        name: string;
        price: number;
        description: string;
    }[];
    itinerary: Record<string, unknown>[];
    inclusions: string[];
    residence: string;
}

export const MOCK_TRIP_GROUP: Trip = {
    id: '1',
    title: 'Italy Group Trip',
    description: 'Experience the magic of Italy with a group of like-minded travelers.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200',
    is_group_trip: true,
    fixed_date: '2024-06-15',
    inclusions: ['Accommodation', 'Breakfast', 'Guided Tours'],
    itinerary: [],
    residence: '4-star Hotel in Rome',
};

export const MOCK_TRIP_FLEX: Trip = {
    id: '2',
    title: 'Maldives Package',
    description: 'Relax in the pristine waters of the Maldives on your own schedule.',
    price: 1000, // Base or starting price
    image: 'https://images.unsplash.com/photo-1514282401047-d77a711ef62e?auto=format&fit=crop&q=80&w=1200',
    is_group_trip: false,
    pricing_options: [
        { name: '4 Star', price: 1000, description: 'Comfortable island stay' },
        { name: '5 Star', price: 1500, description: 'Luxury overwater villa' },
    ],
    inclusions: ['Airport Transfer', 'Breakfast'],
    itinerary: [],
    residence: 'Beach Resort',
};
