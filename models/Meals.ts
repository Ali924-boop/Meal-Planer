// lib/seasons.ts

import { getMonth } from "date-fns";

export type Season = "Winter" | "Spring" | "Summer" | "Monsoon" | "Autumn";

export const seasonalDishes: Record<Season, { veg: string[]; nonVeg: string[] }> = {
    Winter: {
        veg: [
            "Gajar ka Halwa",
            "Sarson ka Saag",
            "Methi Aloo",
            "Palak Paneer",
            "Mix Sabzi",
            "Lauki Curry",
            "Daal Chawal",
            "Khichdi"
        ],
        nonVeg: [
            "Chicken Karahi",
            "Beef Nihari",
            "Mutton Paya",
            "Chicken Handi",
            "Beef Korma",
            "Chicken Biryani",
            "Keema Matar"
        ]
    },

    Spring: {
        veg: [
            "Chana Daal",
            "Aloo Palak",
            "Vegetable Pulao",
            "Bhindi Masala",
            "Daal Fry",
            "Mix Vegetables"
        ],
        nonVeg: [
            "Chicken Tikka",
            "Chicken Qorma",
            "Chicken Pulao",
            "Beef Karahi",
            "Anda Curry"
        ]
    },

    Summer: {
        veg: [
            "Dahi Bhalla",
            "Aloo Raita",
            "Lassi",
            "Kari Pakora",
            "Chana Chaat",
            "Fruit Chaat",
            "Moong Daal"
        ],
        nonVeg: [
            "Chicken Salad",
            "Grilled Chicken",
            "Chicken Sandwich",
            "Light Chicken Curry",
            "Anda Bhurji"
        ]
    },

    Monsoon: {
        veg: [
            "Pakoray",
            "Samosay",
            "Aloo Pakora",
            "Chai Biscuit",
            "Daal Chawal",
            "Sabzi Karahi"
        ],
        nonVeg: [
            "Chicken Pakora",
            "Chicken Karahi",
            "Anda Pakora",
            "Spicy Chicken Curry"
        ]
    },

    Autumn: {
        veg: [
            "Pumpkin Curry",
            "Daal Mash",
            "Aloo Baingan",
            "Bhindi",
            "Mix Sabzi",
            "Vegetable Pulao"
        ],
        nonVeg: [
            "Chicken Biryani",
            "Chicken Korma",
            "Beef Qeema",
            "Mutton Curry"
        ]
    }
};



// Breakfast pool (year-round rotation)
export const getBreakfastDishes = () => [
    { name: "Paratha & Chai", type: "Veg" },
    { name: "Halwa Puri", type: "Veg" },
    { name: "Aloo Paratha", type: "Veg" },
    { name: "Anda Paratha", type: "Non-Veg" },
    { name: "Omelette & Toast", type: "Non-Veg" },
    { name: "Chana Chaat", type: "Veg" },
    { name: "Daliya", type: "Veg" },
    { name: "Qeema Paratha", type: "Non-Veg" },
    { name: "Lassi", type: "Veg" },
    { name: "Milk & Biscuit", type: "Veg" },
    { name: "French Toast", type: "Veg" },
    { name: "Anda Bhurji", type: "Non-Veg" },
    { name: "Sooji Halwa", type: "Veg" }
];


// Detect season by month
export function getSeason(date: Date): Season {
    const month = getMonth(date) + 1;

    if (month === 12 || month <= 2) return "Winter";     // Dec - Feb
    if (month >= 3 && month <= 4) return "Spring";       // Mar - Apr
    if (month >= 5 && month <= 7) return "Summer";       // May - Jul
    if (month >= 8 && month <= 9) return "Monsoon";      // Aug - Sep
    return "Autumn";                                     // Oct - Nov
}
