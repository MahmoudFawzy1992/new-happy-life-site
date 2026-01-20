'use client';

import { useState, use } from 'react'; // Added 'use'
import Image from 'next/image';
import { MOCK_TRIP_GROUP, MOCK_TRIP_FLEX } from '@/lib/mock-data';
import BookingForm from '@/components/trip/BookingForm';
import { Star, Users } from 'lucide-react';

// FIX: Type 'params' as a Promise
export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
    // FIX: Unwrap the params using React.use()
    const { id } = use(params);

    // Use the unwrapped 'id' variable
    const trip = id === '1' ? MOCK_TRIP_GROUP : (id === '2' ? MOCK_TRIP_FLEX : null);

    const [activeTab, setActiveTab] = useState('itinerary');

    if (!trip) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold text-gray-400">Trip not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-gray-200">
                <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-8 text-white container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{trip.title}</h1>
                    <p className="text-xl opacity-90 mb-4">{trip.description}</p>
                    <div className="flex items-center gap-4 text-sm font-medium bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> 4.9 (120 reviews)</span>
                        {trip.is_group_trip && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Group Trip</span>}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Layout: Sidebar First (Logical Left) */}
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

                    {/* Sidebar (Booking Form) */}
                    <div className="order-1 lg:sticky lg:top-8">
                        <BookingForm trip={trip} />

                        <div className="mt-6 text-center text-gray-500 text-sm">
                            Need help? <a href="#" className="underline hover:text-blue-600">Contact Support</a>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="order-2">
                        {/* Tabs Headers */}
                        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'itinerary', label: 'Itinerary' },
                                { id: 'residence', label: 'Residence' },
                                { id: 'inclusions', label: 'Inclusions' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-bold uppercase tracking-wide whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Panels */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 min-h-[400px]">
                            {activeTab === 'itinerary' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Daily Itinerary</h2>
                                    <div className="space-y-8">
                                        {[1, 2, 3].map((day) => (
                                            <div key={day} className="flex gap-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                                                        {day}
                                                    </div>
                                                    <div className="flex-1 w-0.5 bg-gray-200 my-2"></div>
                                                </div>
                                                <div className="pb-8">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Day {day}: Adventure Begins</h4>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                                        Start your journey with a comprehensive introduction to the local culture.
                                                        Includes a welcome dinner and a briefing on the days ahead.
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'residence' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Where You&apos;ll Stay</h2>
                                    <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 font-medium">{trip.residence}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="aspect-video bg-gray-200 rounded-lg w-full relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Image 1</div>
                                        </div>
                                        <div className="aspect-video bg-gray-200 rounded-lg w-full relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Image 2</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inclusions' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Included in the Price</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {trip.inclusions.map((inc, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                                                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                                                <span className="text-gray-700 dark:text-gray-200 font-medium">{inc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}