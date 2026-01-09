import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pakistani Meal Planner',
  description: '365-day Dynamic Meal Planner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gray-50 text-gray-900">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
