'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Pill,
  FlaskConical,
  ClipboardList,
  LogOut,
  Clock,
  User,
  ChevronsUpDown,
  Settings,
  CalendarDays,
  BadgeCheck,
  Bell
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const clinicianMenuItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/clinician',
    icon: LayoutDashboard,
  },
  {
    title: 'My Patients',
    href: '/clinician/patients',
    icon: Users,
  },
  {
    title: 'Appointments',
    href: '/clinician/appointments',
    icon: Calendar,
  },
  {
    title: 'Visits',
    href: '/clinician/visits',
    icon: ClipboardList,
  },
  {
    title: 'Diagnoses',
    href: '/clinician/diagnoses',
    icon: Stethoscope,
  },
  {
    title: 'Lab Orders',
    href: '/clinician/lab-orders',
    icon: FlaskConical,
  },
  {
    title: 'Prescriptions',
    href: '/clinician/prescriptions',
    icon: Pill,
  },
];

export function ClinicianSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout, role, timeRemaining, isLoading } = useAuth();
  const roleLabel = role === 'doctor' ? 'Doctor' : role === 'nurse' ? 'Nurse' : 'Clinician';
  
  const formatTimeRemaining = (ms: number | null) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/clinician">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Stethoscope className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base tracking-tight text-blue-900 dark:text-blue-100">MediTrack Pro</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Clinical Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="gap-2 px-2">
          {isLoading ? (
             Array.from({ length: 7 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
             ))
          ) : (
            clinicianMenuItems.map((item) => {
               const Icon = item.icon;
               const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
               return (
                 <SidebarMenuItem key={item.href}>
                   <SidebarMenuButton 
                     asChild 
                     isActive={isActive} 
                     tooltip={item.title}
                     className={cn(
                       "transition-all duration-200 ease-in-out min-h-12",
                       isActive 
                          ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 font-semibold" 
                          : "hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                     )}
                   >
                     <Link href={item.href} className="flex items-center gap-3">
                       <Icon className={cn("size-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                       <span>{item.title}</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               );
            })
          )}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-2">
          {isLoading ? (
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          ) : user && (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                        <Avatar className="h-8 w-8 rounded-lg border border-border">
                             <AvatarImage src={user.prefs?.avatar as string} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-blue-600 font-medium">{roleLabel}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.prefs?.avatar as string} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <CalendarDays className="mr-2 size-4" />
                            <span>My Schedule</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BadgeCheck className="mr-2 size-4" />
                            <span>Credentials</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Settings className="mr-2 size-4" />
                            <span>Profile Settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="mr-2 size-4" />
                            <span>Notifications</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem disabled>
                             <Clock className="mr-2 size-4" />
                             <span>Session: {formatTimeRemaining(timeRemaining)}</span>
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 size-4" />
                        Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
