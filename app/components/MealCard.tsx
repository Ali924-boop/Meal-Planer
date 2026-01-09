'use client';

import { Meal } from '@/lib/mealUtils';
import { Ban, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface MealCardProps {
    meal: Meal;
    onToggle: (id: string) => void;
}

export default function MealCard({ meal, onToggle }: MealCardProps) {
    const [loading, setLoading] = useState(false);

    const isVeg = meal.type === 'Veg';

    const baseClasses = meal.type === 'Veg'
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-amber-50 border-amber-200';

    const textClasses = meal.type === 'Veg'
        ? 'text-emerald-900'
        : 'text-amber-900';

    const badgeClasses = meal.type === 'Veg'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-700';

    const handleToggle = async () => {
        setLoading(true);
        await onToggle(meal._id);
        setLoading(false);
    };

    return (
        <div className={`relative border rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${meal.blocked ? 'opacity-75 grayscale' : ''} ${baseClasses}`}>

            {meal.blocked && (
                <div className="absolute inset-0 bg-gray-50/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="px-3 py-1 bg-red-100 text-red-600 font-bold rounded-full text-sm border border-red-200 transform -rotate-12 shadow-sm">
                        BLOCKED
                    </span>
                </div>
            )}

            <div className="p-4 flex flex-col h-full relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClasses}`}>
                        {meal.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Clock size={12} />
                        {meal.mealTime}
                    </div>
                </div>

                <h3 className={`text-lg font-bold mb-4 ${textClasses} leading-tight`}>
                    {meal.name}
                </h3>

                <div className="mt-auto">
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors 
              ${meal.blocked
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'bg-white/80 border border-transparent hover:bg-white text-gray-800 shadow-sm'
                            }`}
                    >
                        {loading ? (
                            <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                        ) : meal.blocked ? (
                            <>
                                <CheckCircle size={14} className="text-emerald-500" />
                                Unblock Dish
                            </>
                        ) : (
                            <>
                                <Ban size={14} className="text-red-400" />
                                Block Dish
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
