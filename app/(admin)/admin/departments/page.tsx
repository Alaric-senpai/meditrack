import { Suspense } from 'react';
import { listDepartments } from '@/actions/departments.actions';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepartmentsTable, Department } from '@/components/admin/departments-table';
import { CreateDepartmentButton } from './create-dept-button';

export default async function DepartmentsPage() {
  const { departments } = await listDepartments();

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <Building2 className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Hospital Departments</h2>
                <p className="text-muted-foreground">Manage clinical units and administrative departments.</p>
           </div>
        </div>
        <CreateDepartmentButton />
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <Suspense fallback={<div>Loading departments...</div>}>
          <DepartmentsTable data={departments as unknown as Department[] || []} />
        </Suspense>
      </div>
    </div>
  );
}
