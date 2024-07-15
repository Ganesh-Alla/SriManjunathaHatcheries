
import EditPage from '@/app/ui/entries/editPage';
import Breadcrumbs from '@/app/ui/profile/breadcrumbs';


export default async function Page({ params }: { params: { id: string } }) {



    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Entries', href: '/dashboard/entries' },
            {
                label: 'Edit Record',
                href: `/dashboard/entries/${params.id}/edit`,
                active: true,
            },
            ]}
        />
        <EditPage recordId={params.id} />
        </main>
    );
}