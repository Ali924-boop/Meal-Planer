'use client';

import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Meal } from '@/lib/mealUtils';
import MealCard from './MealCard';
import { getSeason } from '@/lib/seasons';
import { Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
    const [meals, setMeals] = useState<{ veg: Meal[]; nonVeg: Meal[] }>({ veg: [], nonVeg: [] });
    const [loading, setLoading] = useState(true);
    const [date] = useState(new Date());
    const [blockedOpen, setBlockedOpen] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const season = getSeason(date);

    // Carousel index per mealTime
    const [carouselIndexes, setCarouselIndexes] = useState<{ [key: string]: number }>({
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
    });

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const dateStr = format(date, 'yyyy-MM-dd');
            const res = await fetch(`/api/meals?date=${dateStr}`);
            const data = await res.json();
            setMeals({ veg: data.veg || [], nonVeg: data.nonVeg || [] });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMeals(); }, []);

    const handleToggle = async (id: string) => {
        setMeals(prev => ({
            veg: prev.veg.map(m => (m._id === id ? { ...m, blocked: !m.blocked } : m)),
            nonVeg: prev.nonVeg.map(m => (m._id === id ? { ...m, blocked: !m.blocked } : m)),
        }));

        await fetch('/api/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mealId: id }),
        });
    };

    const allMeals = [...meals.veg, ...meals.nonVeg];
    const blockedMeals = allMeals.filter(m => m.blocked);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setBlockedOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    const mealTimes = ['Breakfast', 'Lunch', 'Dinner'] as const;

    const next = (time: string, max: number) =>
        setCarouselIndexes(prev => ({ ...prev, [time]: (prev[time] + 1) % max }));

    const prev = (time: string, max: number) =>
        setCarouselIndexes(prev => ({ ...prev, [time]: (prev[time] - 1 + max) % max }));

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

            {/* Header + Blocked Dropdown */}
            <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm flex justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-300 mt-1">
                        Season: <span className="font-semibold text-emerald-600">{season}</span>
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                        Date: {format(date, 'EEEE, MMMM do yyyy')}
                    </p>
                </div>

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
                                            onClick={() => handleToggle(meal._id)}
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
            </div>

            {/* MealTime Cards with Carousel */}
            <div className="flex flex-col gap-6 md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
                {mealTimes.map(time => {
                    const timeMeals = [
                        ...meals.veg.filter(m => m.mealTime === time),
                        ...meals.nonVeg.filter(m => m.mealTime === time),
                    ];

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

                            <div className="relative h-60"> {/* fixed height */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentMeal._id}
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -100, opacity: 0 }}
                                        transition={{ duration: 0.45, ease: [0.43, 0.13, 0.23, 0.96] }}
                                        className="absolute inset-0"
                                    >
                                        <MealCard meal={currentMeal} onToggle={handleToggle} />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Carousel Arrows */}
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
        </div>
    );
}
