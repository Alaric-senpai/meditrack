import { Suspense } from 'react';
import { getAdminUsers } from '@/actions/admin-user.actions';
import { UsersTable, AdminUser } from '@/components/admin/users-table';
import { InviteUserModal } from '@/components/admin/invite-user-modal';
import { DebugLogger } from '@/components/debug/debug-logger';

export default async function UsersPage() {
  const { users } = await getAdminUsers();

  console.log(users)
  return (
    <div className="h-full space-y-4">
      {/* <DebugLogger data={users} label="admin-users-data" /> */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
           <p className="text-muted-foreground">Manage system access, roles, and accounts.</p>
        </div>
        <InviteUserModal />
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersTable data={users as unknown as AdminUser[]} />
        </Suspense>
      </div>
    </div>
  );
}
