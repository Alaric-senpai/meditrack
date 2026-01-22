'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar,
  Pill,
  FlaskConical,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const patientMenuItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/patient/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Medical Records',
    href: '/patient/records',
    icon: FileText,
  },
  {
    title: 'Appointments',
    href: '/patient/appointments',
    icon: Calendar,
  },
  {
    title: 'Prescriptions',
    href: '/patient/prescriptions',
    icon: Pill,
  },
  {
    title: 'Lab Results',
    href: '/patient/lab-results',
    icon: FlaskConical,
  },
  {
    title: 'My Profile',
    href: '/patient/profile',
    icon: User,
  },
];

export function PatientSidebar() {
  const pathname = usePathname();
  const { user, logout, timeRemaining } = useAuth();

  const formatTimeRemaining = (ms: number | null) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">Patient Portal</h2>
        </div>
        {user && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{user.name}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            {timeRemaining !== null && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Session: {formatTimeRemaining(timeRemaining)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {patientMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.title}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
