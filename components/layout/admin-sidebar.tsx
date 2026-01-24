'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield,
  LogOut,
  ChevronRight,
  Crown,
  Activity,
  Database,
  FileText,
  ChevronsUpDown,
  Bell,
  HardDrive,
  Lock,
  FlaskConical,
  Pill
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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

const sidebarGroups = [
  {
    label: "Core",
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
    ]
  },
  {
    label: "Clinical Services",
    items: [
      {
        title: 'Departments',
        href: '/admin/departments',
        icon: Database,
      },
      {
        title: 'Doctors',
        href: '/admin/doctors',
        icon: Shield,
      },
      {
        title: 'Nurses',
        href: '/admin/nurses',
        icon: Activity,
      },
      {
        title: 'Lab Technicians',
        href: '/admin/lab-technicians',
        icon: FlaskConical,
      },
      {
        title: 'Pharmacists',
        href: '/admin/pharmacists',
        icon: Pill,
      },
    ]
  },
  {
    label: "User Management",
    items: [
       {
        title: 'Patients',
        href: '/admin/patients',
        icon: Users,
      },
      {
        title: 'All Users',
        href: '/admin/users',
        icon: Users,
      },
    ]
  },
  {
    label: "System & Records",
    items: [
      {
        title: 'Audit Logs',
        href: '/admin/logs',
        icon: FileText,
      },
      {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ]
  }
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Crown className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-base tracking-tight text-amber-900 dark:text-amber-100">MediTrack Panel</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Administration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isLoading ? (
           <SidebarMenu className="gap-2 px-2">
             {Array.from({ length: 8 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
             ))}
           </SidebarMenu>
        ) : (
          sidebarGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive} 
                          tooltip={item.title}
                          className={cn(
                            "transition-all duration-200 ease-in-out px-3",
                            isActive 
                               ? "bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-900/30 dark:text-amber-300 font-semibold" 
                               : "hover:bg-amber-50 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <Icon className={cn("size-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-2">
          {user ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                        <Avatar className="h-8 w-8 rounded-lg border border-border/50">
                             <AvatarImage src={user.prefs?.avatar as string} alt={user.name} />
                            <AvatarFallback className="rounded-lg bg-amber-100 text-amber-700 font-bold">
                                {user.name?.charAt(0) || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-amber-600 font-medium">Administrator</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-border shadow-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.prefs?.avatar as string} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                {user.name?.charAt(0)}
                            </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <HardDrive className="mr-2 size-4" />
                            <span>System Settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                             <Users className="mr-2 size-4" />
                             <span>User Management</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Lock className="mr-2 size-4" />
                            <span>Audit Logs</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="mr-2 size-4" />
                            <span>Notifications</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 size-4" />
                        Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
               loading...
            </div>
          )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
