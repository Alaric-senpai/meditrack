import { Suspense } from 'react';
import { getAuditLogs } from '@/actions/admin-logs.actions';
import { AuditLogsTable, AuditLog } from '@/components/admin/audit-logs-table';

export default async function AuditLogsPage() {
  const { logs } = await getAuditLogs();

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">System Audit Logs</h2>
           <p className="text-muted-foreground">Traceability and compliance monitoring.</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <Suspense fallback={<div>Loading logs...</div>}>
          <AuditLogsTable data={logs as unknown as AuditLog[]} />
        </Suspense>
      </div>
    </div>
  );
}
