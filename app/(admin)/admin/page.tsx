import { Suspense } from 'react';
import { getSystemStats } from '@/actions/admin-stats.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Activity, ShieldAlert, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { UserDistributionChart, RegistrationTrendChart } from '@/components/admin/dashboard-charts';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboard() {
  const { stats, success } = await getSystemStats();

  if (!success || !stats) {
     return (
        <div className="flex h-full items-center justify-center p-6">
            <Card className="w-full max-w-md border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">System Error</CardTitle>
                    <CardDescription>Failed to fetch real-time system statistics.</CardDescription>
                </CardHeader>
            </Card>
        </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Factual system metrics and operational status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all system roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded Patients</CardTitle>
            <Activity className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Unique clinical records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Trail</CardTitle>
            <ShieldAlert className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">Logged system activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats.health.api}</div>
            <p className="text-xs text-muted-foreground">All core services online</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of system users by clinical and administrative roles.</CardDescription>
          </CardHeader>
          <CardContent>
             <UserDistributionChart data={stats.roleDistribution} />
          </CardContent>
        </Card>
        
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>Latest events from the system audit log.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
             <div className="space-y-4 px-6">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-4">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                             <Clock className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{activity.action}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{activity.details}</p>
                            <span className="text-[10px] font-mono text-slate-400">User: {activity.userId}</span>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Environment Status</CardTitle>
                <CardDescription>Real-time connectivity to backend services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/5 border-green-500/20">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-sm">Appwrite Management API</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Online</Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/5 border-green-500/20">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-sm">PostgreSQL / TablesDB</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Operational</Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/5 border-green-500/20">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-sm">Vault Storage Buckets</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Secure</Badge>
                 </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-4">
             <CardHeader>
                <CardTitle>7-Day Registration Trend</CardTitle>
                <CardDescription>User onboarding volume over the current week.</CardDescription>
             </CardHeader>
             <CardContent>
                <RegistrationTrendChart />
             </CardContent>
          </Card>
      </div>
    </div>
  );
}
