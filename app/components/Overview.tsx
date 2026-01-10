'use client';

import { useEffect, useState, useRef } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Loader2, X } from 'lucide-react';
import MealCard from './MealCard';
import { Meal } from '@/lib/mealUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Overview() {
    const [date, setDate] = useState(new Date());
    const [meals, setMeals] = useState<{ veg: Meal[]; nonVeg: Meal[] }>({ veg: [], nonVeg: [] });
    const [loading, setLoading] = useState(true);
    const [carouselIndexes, setCarouselIndexes] = useState<{ [key: string]: number }>({
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
    });
    const [blockedOpen, setBlockedOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchData = async (targetDate: Date) => {
        setLoading(true);
        try {
            const dateStr = format(targetDate, 'yyyy-MM-dd');
            const res = await fetch(`/api/meals?date=${dateStr}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setMeals({ veg: data.veg || [], nonVeg: data.nonVeg || [] });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(date);
    }, [date]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setBlockedOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleBlock = async (mealId: string) => {
        const toggleMeal = (list: Meal[]) => list.map(m => m._id === mealId ? { ...m, blocked: !m.blocked } : m);

        setMeals(prev => ({
            veg: toggleMeal(prev.veg),
            nonVeg: toggleMeal(prev.nonVeg),
        }));

        try {
            await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mealId }),
            });
        } catch (e) {
            console.error(e);
            fetchData(date);
        }
    };

    const mealTimes = ['Breakfast', 'Lunch', 'Dinner'] as const;

    const allMeals = [...meals.veg, ...meals.nonVeg];
    const blockedMeals = allMeals.filter(m => m.blocked);

    const next = (time: string, max: number) =>
        setCarouselIndexes(prev => ({ ...prev, [time]: (prev[time] + 1) % max }));
    const prev = (time: string, max: number) =>
        setCarouselIndexes(prev => ({ ...prev, [time]: (prev[time] - 1 + max) % max }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Date Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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

            {/* Blocked Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setBlockedOpen(!blockedOpen)}
                    className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 px-3 py-1 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition"
                >
                    🚫 Blocked ({blockedMeals.length})
                </button>

                <AnimatePresence>
                    {blockedOpen && blockedMeals.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 max-h-72 overflow-y-auto space-y-2"
                        >
                            {blockedMeals.map(meal => (
                                <div
                                    key={meal._id}
                                    className="flex items-center justify-between px-2 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                >
                                    <span className="truncate">{meal.name}</span>
                                    <button
                                        onClick={() => handleToggleBlock(meal._id)}
                                        className="hover:text-red-800 dark:hover:text-red-400 transition"
                                        title="Unblock"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Meals Carousel */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                </div>
            ) : (
                <div className="flex flex-col gap-6 md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
                    {mealTimes.map(time => {
                        const timeMeals = [...meals.veg.filter(m => m.mealTime === time), ...meals.nonVeg.filter(m => m.mealTime === time)];
                        if (timeMeals.length === 0) return null;

                        const index = carouselIndexes[time];
                        const currentMeal = timeMeals[index];

                        return (
                            <motion.div
                                key={time}
                                className="bg-white dark:bg-gray-800 border rounded-2xl shadow p-4 w-full max-w-sm mx-auto hover:scale-105 transition-transform duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{time}</h3>

                                <div className="relative h-72">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentMeal._id}
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -100, opacity: 0 }}
                                            transition={{ duration: 0.45, ease: [0.43, 0.13, 0.23, 0.96] }}
                                            className="absolute inset-0"
                                        >
                                            <MealCard meal={currentMeal} onToggle={handleToggleBlock} />
                                        </motion.div>
                                    </AnimatePresence>

                                    {timeMeals.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => prev(time, timeMeals.length)}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-70 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition z-20"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => next(time, timeMeals.length)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-70 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition z-20"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Pagination Dots */}
                                {timeMeals.length > 1 && (
                                    <div className="flex justify-center mt-2 space-x-1">
                                        {timeMeals.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
