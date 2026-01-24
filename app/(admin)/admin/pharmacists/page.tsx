import { Suspense } from 'react';
import { getAdminUsers } from '@/actions/admin-user.actions';
import { AdminUser } from '@/components/admin/users-table';
import { PharmacistsPageClient } from './pharmacists-client';

export default async function PharmacistsPage() {
  const { users } = await getAdminUsers(undefined, 'pharmacist');

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading pharmacy professionals...</div>}>
      <PharmacistsPageClient initialData={users as unknown as AdminUser[]} />
    </Suspense>
  );
}
