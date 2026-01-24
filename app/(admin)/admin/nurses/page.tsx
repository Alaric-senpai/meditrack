import { Suspense } from 'react';
import { getAdminUsers } from '@/actions/admin-user.actions';
import { AdminUser } from '@/components/admin/users-table';
import { NursesPageClient } from './nurses-client';

export default async function NursesPage() {
  const { users } = await getAdminUsers(undefined, 'nurse');

  return (
    <Suspense fallback={<div>Loading nursing staff...</div>}>
      <NursesPageClient initialData={users as unknown as AdminUser[]} />
    </Suspense>
  );
}
