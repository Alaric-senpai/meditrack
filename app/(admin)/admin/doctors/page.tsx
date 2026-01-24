import { Suspense } from 'react';
import { getAdminUsers } from '@/actions/admin-user.actions';
import { AdminUser } from '@/components/admin/users-table';
import { DoctorsPageClient } from './doctors-client';

export default async function DoctorsPage() {
  const { users } = await getAdminUsers(undefined, 'doctor');

  return (
    <Suspense fallback={<div>Loading clinicians...</div>}>
      <DoctorsPageClient initialData={users as unknown as AdminUser[]} />
    </Suspense>
  );
}
