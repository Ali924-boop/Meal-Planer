export type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

export interface Dish {
    name: string;
    type: 'Veg' | 'Non-Veg';
}

const breakfastDishes: string[] = [
    'Halwa Puri', 'Anda Paratha', 'Chana Puri', 'Omelette Bread', 'Aloo Paratha',
    'Nihari (Morning)', 'Paye (Morning)', 'Lassi & Paratha', 'Fried Egg & Toast', 'French Toast',
    'Sujee Halwa', 'Qeema Paratha', 'Cholai & Kulcha'
];

export const getBreakfastDishes = (): Dish[] => {
    return breakfastDishes.map(name => ({ name, type: name.includes('Qeema') || name.includes('Nihari') || name.includes('Paye') ? 'Non-Veg' : 'Veg' }));
};

export const seasonalDishes: Record<Season, { veg: string[], nonVeg: string[] }> = {
    Winter: {
        veg: [
            'Sarson Ka Saag', 'Daal Tadka', 'Palak Paneer', 'Aloo Gobi', 'Mix Sabzi',
            'Methi Aloo', 'Gajar Matar', 'Baingan Ka Bharta', 'Rajma Masala', 'Chana Masala'
        ],
        nonVeg: [
            'Chicken Paya', 'Mutton Karahi', 'Beef Nihari', 'Fish Fry', 'Chapli Kabab',
            'Chicken Corn Soup', 'Mutton Pulao', 'Chicken Haleem', 'Kunna Gosht', 'Hareesa'
        ]
    },
    Spring: {
        veg: [
            'Palak Paneer', 'Methi Aloo', 'Bhindi Masala', 'Karela Pyaz', 'Tinda Masala',
            'Lauki Chana', 'Aloo Baingan', 'Shimla Mirch Aloo', 'Daal Mash', 'Kadhi Pakora'
        ],
        nonVeg: [
            'Chicken Karahi', 'Beef Korma', 'Mutton Korma', 'Chicken Biryani', 'Chicken Tikka',
            'Seekh Kabab', 'White Chicken Karahi', 'Beef Pulao', 'Chicken Handi', 'Aloo Keema'
        ]
    },
    Summer: {
        veg: [
            'Bhindi Masala', 'Corn Salad', 'Tinda Fry', 'Lauki Sabzi', 'Torai Ki Sabzi',
            'Arvi Masala', 'Daal Chawal', 'Kadu Sharif', 'Aloo Bhujia', 'Bindi Pyaz'
        ],
        nonVeg: [
            'Grilled Chicken', 'Fish Tikka', 'Chicken Ginger', 'Lemon Chicken', 'Beef Kabab',
            'Steam Roast', 'Chicken Shashlik', 'Mutton Chops', 'Reshmi Kabab', 'Chicken Hara Masala'
        ]
    },
    Autumn: {
        veg: [
            'Pumpkin Curry', 'Mix Veg', 'Daal Makhani', 'Shalgam Palak', 'Aloo Matar',
            'Gobhi Aloo', 'Baingan Aloo', 'Lobia Masala', 'White Chana', 'Masoor Daal'
        ],
        nonVeg: [
            'Beef Nihari', 'Chicken Korma', 'Mutton Kunna', 'Chicken Jalfrezi', 'Beef Haleem',
            'Mutton Stew', 'Chicken Achari', 'Kofte Curry', 'Pasanday', 'Chicken Roast'
        ]
    }
};

export function getSeason(date: Date): Season {
    const month = date.getMonth(); // 0-11

    // Winter: Dec (11), Jan (0), Feb (1)
    if (month === 11 || month === 0 || month === 1) return 'Winter';

    // Spring: Mar (2), Apr (3), May (4)
    if (month >= 2 && month <= 4) return 'Spring';

    // Summer: Jun (5), Jul (6), Aug (7)
    if (month >= 5 && month <= 7) return 'Summer';

    // Autumn: Sep (8), Oct (9), Nov (10)
    return 'Autumn';
}
