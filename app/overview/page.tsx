import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Dashboard from '../dashboard/page';
import Overview from '../components/Overview';

export default async function OverviewPage() {
    const session = await getServerSession(authOptions);

    // Agar login nahi → Dashboard par bhejo
    if (!session) {
        redirect('/overview');
    }

    // Agar login hai → Overview show karo
    return <Overview />;
}
