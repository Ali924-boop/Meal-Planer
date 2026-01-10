'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    LogOut,
    Utensils,
    User,
    ChevronDown,
    LogIn,
    Sun,
    Moon,
    Menu,
    X,
} from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl text-white shadow">
                        <Utensils size={20} />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Pakistani
                        </span>{' '}
                        Meal Planner
                    </h1>
                </div>

                {/* Desktop Right Side */}
                <div className="hidden md:flex items-center gap-4 relative">

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {session ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* User Profile / Dropdown Trigger */}
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                                    <User size={14} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                                    {session.user?.name || session.user?.email}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`${dropdownOpen ? 'rotate-180' : ''} transition`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                    <Link
                                        href="/overview"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        Overview
                                    </Link>
                                    <Link
                                        href="/allplans"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        My Plans
                                    </Link>

                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                            <LogIn size={16} />
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center gap-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden px-4 py-2 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    {session ? (
                        <>
                            <Link
                                href="/overview"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            >
                                Overview
                            </Link>

                            <Link
                                href="/dashboard"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                            <LogIn size={16} />
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
