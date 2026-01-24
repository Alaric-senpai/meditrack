import { Suspense } from 'react';
import { getAdminPatients } from '@/actions/admin-patient.actions';
import { Patient } from '@/components/admin/patients-table';
import { PatientsPageClient } from './patients-client';

export default async function AdminPatientsPage() {
  const { patients } = await getAdminPatients();

  return (
    <Suspense fallback={<div>Loading patient database...</div>}>
      <PatientsPageClient initialData={patients as unknown as Patient[]} />
    </Suspense>
  );
}
