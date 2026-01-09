'use client';

import { signOut, useSession } from 'next-auth/react';
import { LogOut, Utensils } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 sm:px-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                    <Utensils size={20} />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                    Meal<span className="text-gray-800">Planner</span>
                </h1>
            </div>

            {session && (
                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-gray-600">
                        Hello, <strong>{session.user?.name || session.user?.email}</strong>
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            )}
        </nav>
    );
}
