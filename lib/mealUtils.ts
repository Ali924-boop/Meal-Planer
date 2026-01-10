import { v5 as uuidv5 } from 'uuid';
import { getSeason, seasonalDishes, getBreakfastDishes } from './seasons';
import { getDayOfYear, parseISO } from 'date-fns';

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export interface Meal {
    _id: string;
    name: string;
    type: 'Veg' | 'Non-Veg';
    mealTime: 'Breakfast' | 'Lunch' | 'Dinner';
    blocked: boolean;
    date: string;
    season: 'Summer' | 'Winter' | 'Spring' | 'Autumn' | string; // ✅ Add season
}

export function generateMealsForDate(
    dateStr: string,
    blockedMealIds: string[] = []
): { veg: Meal[]; nonVeg: Meal[] } {

    // Validate dateStr
    const date = !isNaN(Date.parse(dateStr)) ? parseISO(dateStr) : new Date();
    const safeDateStr = date.toISOString().split('T')[0];

    const season = getSeason(date); // current season
    const dayOfYear = getDayOfYear(date);

    const seasonData = seasonalDishes[season];
    const breakfastPool = getBreakfastDishes();

    const meals: Meal[] = [];

    const createMeal = (
        name: string,
        type: 'Veg' | 'Non-Veg',
        mealTime: 'Breakfast' | 'Lunch' | 'Dinner'
    ): Meal => {
        const uniqueString = `${safeDateStr}-${mealTime}-${name}`;
        const _id = uuidv5(uniqueString, NAMESPACE);

        return {
            _id,
            name,
            type,
            mealTime,
            blocked: blockedMealIds.includes(_id),
            date: safeDateStr,
            season, // ✅ Assign season here
        };
    };

    // --- Breakfast (2 items)
    const b1 = breakfastPool[dayOfYear % breakfastPool.length];
    const b2 = breakfastPool[(dayOfYear + 1) % breakfastPool.length];
    meals.push(createMeal(b1.name, b1.type, 'Breakfast'));
    meals.push(createMeal(b2.name, b2.type, 'Breakfast'));

    // --- Lunch (1 Veg, 1 Non-Veg)
    const lVeg = seasonData.veg[dayOfYear % seasonData.veg.length];
    const lNonVeg = seasonData.nonVeg[dayOfYear % seasonData.nonVeg.length];
    meals.push(createMeal(lVeg, 'Veg', 'Lunch'));
    meals.push(createMeal(lNonVeg, 'Non-Veg', 'Lunch'));

    // --- Dinner (1 Veg, 1 Non-Veg, offset for variety)
    const dVeg = seasonData.veg[(dayOfYear + 5) % seasonData.veg.length];
    const dNonVeg = seasonData.nonVeg[(dayOfYear + 5) % seasonData.nonVeg.length];
    meals.push(createMeal(dVeg, 'Veg', 'Dinner'));
    meals.push(createMeal(dNonVeg, 'Non-Veg', 'Dinner'));

    return {
        veg: meals.filter(m => m.type === 'Veg'),
        nonVeg: meals.filter(m => m.type === 'Non-Veg'),
    };
}
