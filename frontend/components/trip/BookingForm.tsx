'use client';

import { useState } from 'react';
import { Trip } from '@/lib/mock-data';
import { useCartStore } from '@/store/useCartStore';

interface BookingFormProps {
    trip: Trip;
}

export default function BookingForm({ trip }: BookingFormProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    // State for flexible trips
    const [selectedDate, setSelectedDate] = useState('');
    // Initialize with first option or empty
    const [selectedOption, setSelectedOption] = useState(trip.pricing_options?.[0]?.name || '');

    // Calculate price dynamically
    const currentPrice = trip.is_group_trip
        ? trip.price
        : trip.pricing_options?.find(opt => opt.name === selectedOption)?.price || trip.price;

    const handleBookNow = () => {
        // Basic validation
        if (!trip.is_group_trip && !selectedDate) return;

        const bookingJson = {
            id: trip.id,
            title: trip.title,
            date: trip.is_group_trip ? trip.fixed_date! : selectedDate,
            price: currentPrice,
            guests: 1,
            hotelOption: trip.is_group_trip ? undefined : selectedOption,
        };

        console.log('Booking Selection:', bookingJson);
        addToCart(bookingJson);

        alert(`تمت الإضافة للسلة!\n${JSON.stringify(bookingJson, null, 2)}`);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">احجز رحلتك</h3>

            {/* Price Display */}
            <div className="text-3xl font-bold text-blue-600 mb-6 flex items-end gap-1">
                <span>{currentPrice.toLocaleString()}</span>
                <span className="text-sm font-normal text-gray-500 mb-1">ريال / للشخص</span>
            </div>

            {/* Date Logic */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">تاريخ الرحلة</label>
                {trip.is_group_trip ? (
                    <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-between">
                        <span className="font-mono font-bold">{trip.fixed_date}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ميعاد ثابت</span>
                    </div>
                ) : (
                    <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                )}
            </div>

            {/* Hotel Options for Flexible */}
            {!trip.is_group_trip && trip.pricing_options && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">خيارات السكن</label>
                    <div className="space-y-2">
                        {trip.pricing_options.map((option) => (
                            <label
                                key={option.name}
                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedOption === option.name
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="hotel-option"
                                        value={option.name}
                                        checked={selectedOption === option.name}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{option.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{option.price} ريال</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleBookNow}
                disabled={!trip.is_group_trip && !selectedDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
                تأكيد الحجز
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
                لا يتم خصم المبلغ فوراً
            </p>
        </div>
    );
}