// app/api/allplans/route.ts
import { NextResponse } from 'next/server';
import { Meal } from '@/lib/mealUtils';

export async function GET() {
    const plans: { date: string; meals: Meal[] }[] = [
        { date: '2026-01-10', meals: [] },
        { date: '2026-01-11', meals: [] },
    ];
    return NextResponse.json(plans);
}
