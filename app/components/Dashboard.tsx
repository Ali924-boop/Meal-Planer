'use client';

import { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import MealCard from './MealCard';
import { Meal } from '@/lib/mealUtils';

export default function Dashboard() {
    const [date, setDate] = useState(new Date());
    const [meals, setMeals] = useState<{ veg: Meal[], nonVeg: Meal[] }>({ veg: [], nonVeg: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = async (targetDate: Date) => {
        setLoading(true);
        try {
            const dateStr = format(targetDate, 'yyyy-MM-dd');
            const res = await fetch(`/api/meals?date=${dateStr}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setMeals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(date);
    }, [date]);

    const handleToggleBlock = async (mealId: string) => {
        // Optimistic update
        const toggleMeal = (list: Meal[]) => list.map(m => m._id === mealId ? { ...m, blocked: !m.blocked } : m);

        setMeals(prev => ({
            veg: toggleMeal(prev.veg),
            nonVeg: toggleMeal(prev.nonVeg)
        }));

        try {
            await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mealId })
            });
            // In a real app we might revert if failed, but sticking to simple for now
        } catch (e) {
            console.error(e);
            // Revert if needed
            fetchData(date);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Date Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button
                    onClick={() => setDate(subDays(date, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="text-center my-2 sm:my-0">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                        <Calendar size={24} className="text-emerald-500" />
                        {format(date, 'EEEE, MMMM do, yyyy')}
                    </h2>
                    {isSameDay(date, new Date()) && (
                        <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            Today
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setDate(addDays(date, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...meals.veg, ...meals.nonVeg]
                        .sort((a, b) => {
                            const order = { 'Breakfast': 1, 'Lunch': 2, 'Dinner': 3 };
                            return (order[a.mealTime] || 4) - (order[b.mealTime] || 4);
                        })
                        .map(meal => (
                            <MealCard key={meal._id} meal={meal} onToggle={handleToggleBlock} />
                        ))}
                    {meals.veg.length === 0 && meals.nonVeg.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 italic py-12">No meals scheduled for this date.</p>
                    )}
                </div>
            )}
        </div>
    );
}
