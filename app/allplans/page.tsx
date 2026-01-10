'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Info } from 'lucide-react';
import MealCard from '../components/MealCard';
import { Meal } from '@/lib/mealUtils';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlanDay {
    date: string;
    meals: (Meal & { rescheduled?: boolean; originalDate?: string })[];
}

export default function AllPlans() {
    const [plans, setPlans] = useState<PlanDay[]>([]);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/allplans');
                const data = await res.json();
                console.log("Fetched plans:", data); // <-- ye check karo console me
                setPlans(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);


    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/allplans');
            const data = await res.json();
            setPlans(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (mealId: string) => {
        setPlans(prev => {
            let updated = prev.map(day => ({
                ...day,
                meals: day.meals.map(m =>
                    m._id === mealId ? { ...m, blocked: !m.blocked } : m
                ),
            }));

            // Reschedule blocked meal
            updated = updated.map((day, i) => {
                const blockedMeals = day.meals.filter(m => m._id === mealId && m.blocked);
                if (blockedMeals.length && i < updated.length - 1) {
                    const rescheduledMeal = {
                        ...blockedMeals[0],
                        blocked: false,
                        rescheduled: true,
                        originalDate: day.date,
                    };
                    updated[i + 1].meals.push(rescheduledMeal);
                    day.meals = day.meals.filter(m => m._id !== mealId);
                }
                return day;
            });

            return updated;
        });

        try {
            await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mealId }),
            });
        } catch (err) {
            console.error(err);
            fetchPlans();
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const activeId = event.active?.id;
        const overId = event.over?.id;
        if (!activeId || !overId || activeId === overId) return;

        // Find day where active meal is
        const dayIndex = plans.findIndex(day =>
            day.meals.some(m => m._id === activeId)
        );
        if (dayIndex === -1) return;

        const dayMeals = [...plans[dayIndex].meals];
        const oldIndex = dayMeals.findIndex(m => m._id === activeId);
        const newIndex = dayMeals.findIndex(m => m._id === overId);
        if (oldIndex === -1 || newIndex === -1) return;

        const newMeals = arrayMove(dayMeals, oldIndex, newIndex);
        setPlans(prev => {
            const copy = [...prev];
            copy[dayIndex] = { ...copy[dayIndex], meals: newMeals };
            return copy;
        });

        // Optional: send to API
        fetch('/api/reschedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: plans[dayIndex].date, meals: newMeals }),
        }).catch(err => console.error(err));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {plans.map(day => (
                    <div key={day.date} className="bg-white dark:bg-gray-800 border rounded-2xl shadow p-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                            {format(new Date(day.date), 'EEEE, MMMM do yyyy')}
                        </h3>

                        <SortableContext items={day.meals.map(m => m._id)} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-wrap gap-4">
                                {day.meals.map(meal => (
                                    <div
                                        key={meal._id}
                                        className={`min-w-[220px] flex-1 relative ${meal.rescheduled ? 'bg-yellow-50 dark:bg-yellow-800/50 rounded-lg p-1' : ''
                                            }`}
                                    >
                                        {meal.rescheduled && meal.originalDate && (
                                            <div className="absolute -top-2 right-2 flex items-center gap-1 text-xs text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-700/50 px-2 py-0.5 rounded-full">
                                                <Info size={12} /> {format(new Date(meal.originalDate), 'do MMM')}
                                            </div>
                                        )}
                                        <SortableMealCard meal={meal} onToggle={handleToggleBlock} />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    );
}

// Sortable wrapper
function SortableMealCard({ meal, onToggle }: { meal: Meal; onToggle: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: meal._id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <MealCard meal={meal} onToggle={onToggle} />
        </div>
    );
}
