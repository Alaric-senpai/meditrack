'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Pill,
  Clock,
  CheckCircle,
  RefreshCw,
  Package,
  LogOut,
  User,
  ChevronsUpDown,
  Settings,
  CalendarDays,
  FileCheck,
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

const pharmacyMenuItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/pharmacy/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Pending Prescriptions',
    href: '/pharmacy/pending',
    icon: Clock,
  },
  {
    title: 'Ready for Pickup',
    href: '/pharmacy/ready',
    icon: Pill,
  },
  {
    title: 'Dispensed',
    href: '/pharmacy/dispensed',
    icon: CheckCircle,
  },
  {
    title: 'Refill Requests',
    href: '/pharmacy/refills',
    icon: RefreshCw,
  },
  {
    title: 'Inventory',
    href: '/pharmacy/inventory',
    icon: Package,
  },
];

export function PharmacySidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout, timeRemaining, isLoading } = useAuth();
  
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
              <Link href="/pharmacy">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Pill className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base tracking-tight text-emerald-900 dark:text-emerald-100">MediTrack Pro</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pharmacy Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-2 px-2">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
             ))
          ) : (
            pharmacyMenuItems.map((item) => {
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
                          ? "bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-300 font-semibold" 
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
                            <span className="truncate text-xs text-emerald-600 font-medium">Pharmacist</span>
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
                            <FileCheck className="mr-2 size-4" />
                            <span>License Info</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                             <CalendarDays className="mr-2 size-4" />
                             <span>Shift Schedule</span>
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
