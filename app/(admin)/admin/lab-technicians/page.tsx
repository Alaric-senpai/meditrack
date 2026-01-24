import { Suspense } from 'react';
import { getAdminUsers } from '@/actions/admin-user.actions';
import { AdminUser } from '@/components/admin/users-table';
import { LabTechsPageClient } from './lab-techs-client';

export default async function LabTechniciansPage() {
  const { users } = await getAdminUsers(undefined, 'lab-tech');

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading diagnostic professionals...</div>}>
      <LabTechsPageClient initialData={users as unknown as AdminUser[]} />
    </Suspense>
  );
}
