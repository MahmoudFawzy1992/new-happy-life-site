// Replace this URL with your actual Local WP URL later
const WP_API_URL = "http://localhost:8000/wp-json/wp/v2";

export interface Trip {
    id: number;
    title: { rendered: string };
    thumbnail_url: string | null; // The field we added in PHP
    acf?: { // Fallback if we used ACF
        price: string;
    };
    // The custom fields we added in PHP
    price?: string;
    duration_days?: string;
    hotel_rating?: string;
    is_group_trip?: string;
}

export async function getTrips(): Promise<Trip[]> {
    // We fetch standard posts + our custom fields
    // The PHP code we wrote exposes 'price', 'duration_days' directly in the root of the object
    const res = await fetch(`${WP_API_URL}/trip?_embed`, {
        cache: "no-store", // Ensure fresh data during dev
    });

    if (!res.ok) {
        throw new Error("Failed to fetch trips");
    }

    return res.json();
}