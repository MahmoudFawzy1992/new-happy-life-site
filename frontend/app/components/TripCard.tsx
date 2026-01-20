import Image from "next/image";
import type { Trip } from "@/lib/api";

export default function TripCard({ trip }: { trip: Trip }) {
    // Handle price display safely
    const price = trip.price || "Contact Us";
    const rating = trip.hotel_rating || "4";

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100">

            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                {trip.thumbnail_url ? (
                    <Image
                        src={trip.thumbnail_url}
                        alt={trip.title.rendered}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 start-3 flex gap-2">
                    {trip.is_group_trip === "1" && (
                        <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-black shadow-sm">
                            Group Trip
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {trip.title.rendered}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <span>★</span> <span>{rating}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {trip.duration_days && (
                        <div className="flex items-center gap-1">
                            <span>🕒</span> {trip.duration_days} Days
                        </div>
                    )}
                </div>

                {/* Footer / Price */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Starting from</span>
                        <span className="text-xl font-bold text-brand-teal">
                            {price} <span className="text-xs font-normal text-gray-500">SAR</span>
                        </span>
                    </div>
                    <button className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}