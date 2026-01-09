import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateMealsForDate } from '@/lib/mealUtils';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    try {
        await dbConnect();
        // @ts-ignore
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const meals = generateMealsForDate(dateStr, user.blockedMeals || []);

        return NextResponse.json(meals);
    } catch (error) {
        console.error('Meals Fetch Error:', error);
        return NextResponse.json({ message: 'Error fetching meals' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { mealId } = await req.json();

        if (!mealId) {
            return NextResponse.json({ message: 'Missing mealId' }, { status: 400 });
        }

        await dbConnect();
        // @ts-ignore
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const blockedIndex = user.blockedMeals.indexOf(mealId);

        if (blockedIndex > -1) {
            // Unblock
            user.blockedMeals.splice(blockedIndex, 1);
        } else {
            // Block
            user.blockedMeals.push(mealId);
        }

        await user.save();

        return NextResponse.json({
            blocked: blockedIndex === -1
        });

    } catch (error) {
        console.error('Meals Block Error:', error);
        return NextResponse.json({ message: 'Error updating meal' }, { status: 500 });
    }
}
