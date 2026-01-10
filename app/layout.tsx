import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './auth-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />

          <main className="flex-grow bg-gray-50 text-gray-900">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
