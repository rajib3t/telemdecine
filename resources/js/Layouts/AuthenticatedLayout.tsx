import React, { useState, useCallback, useMemo } from 'react';
import { Button } from "@/Components/ui/button";
import NavItem from '@/Components/NavItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Menu, User, Home, Settings, LogOut, Bell, LucideIcon, Users, Building, Shield, List, Plus, View, BookUser, CalendarCheck2 } from "lucide-react";
import { Link, usePage } from '@inertiajs/react';
import { Toaster } from "@/Components/ui/toaster";


interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenus?: MenuItem[];
  routeName?: string[];
}

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  brandName?: string;
  brandIcon?: LucideIcon;
  customMenuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    href: route('dashboard.index'),
    routeName: ['dashboard.index']
  },
  {
    icon:CalendarCheck2,
    label:'Confirmations',
    href:route('confirm.appointment.index'),
    routeName:['confirm.appointment.index']
  },
  {
    icon: BookUser,
    label:'Appointments',
    submenus:[
        {
            icon: List,
            label:'List',
            href:route('appointment.index'),
            routeName:['appointment.index','appointment.add.patient']
        }
    ]
  },
  {
    icon:View,
    label:'Visits',
    submenus:[
        {
            icon:List,
            label:'List',
            href:route('visit.index'),
            routeName:['visit.index','visit.edit']
        },
        {
            icon:Plus,
            label:'Create',
            href:route('visit.create'),
            routeName:['visit.create']
        }
    ]
  },
  {
    icon: Building,
    label: 'Departments',
    submenus:[
        {
            icon:List,
            label:'List',
            href:route('department.index'),
            routeName:['department.index','department.edit']
        },
        {
            icon:Plus,
            label:'Create',
            href:route('department.create'),
            routeName:['department.create']
        }
    ]
  },
  {
    icon: Users,
    label: 'User Management',
    submenus: [
      {
        icon: Users,
        label: 'All Users',
        submenus:[
            {
                icon:List,
                label:'List',
                href:route('user.index'),
                routeName:['user.index','user.edit']
            },
            {
                icon:Plus,
                label:'Create',
                href:route('user.create'),
                routeName:['user.create']
            }
        ]
      },
      {
        icon: Shield,
        label: 'Roles',
        submenus: [
          {
            icon: List,
            label: 'List',
            href: route('role.index'),
            routeName: ['role.index','role.edit']
          },
          {
            icon: Plus,
            label: 'Create',
            href: route('role.create'),
            routeName: ['role.create']
          },
        ]
      },
      {
        icon: Settings,
        label: 'Permissions',
        submenus: [
          {
            icon: List,
            label: 'List',
            href: route('permission.index'),
            routeName: ['permission.index','permission.edit']
          }
        ]
      }
    ]
  },


];

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
};

const UserMenu: React.FC = () => {
  const { user } = usePage().props.auth;
  const userInitials = useMemo(() =>
    user.name.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase(),
    [user.name]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} /> */}
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={route('profile.edit')} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="flex w-full items-center text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  brandName = 'MyApp',
  brandIcon: BrandIcon = Settings,
  customMenuItems
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const menuItems = useMemo(() =>
    customMenuItems || defaultMenuItems,
    [customMenuItems]
  );

  const handleItemClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
  }, []);

  const NavigationContent = useCallback(() => (
    <nav className="flex-1 space-y-2 overflow-y-auto py-4">
      {menuItems.map((item) => (
        <NavItem
          key={item.label}
          {...item}
          onItemClick={handleItemClick}
        />
      ))}
    </nav>
  ), [menuItems, handleItemClick]);

  const BrandLogo = useCallback(() => (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <BrandIcon className="h-6 w-6" />
      {brandName}
    </Link>
  ), [brandName, BrandIcon]);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden h-screen w-64 border-r bg-background p-4 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center px-2">
              <BrandLogo />
            </div>
            <NavigationContent />
            <div className="border-t pt-4">
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href={route('profile.edit')}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b px-6">
                <BrandLogo />
              </div>
              <div className="p-4">
                <NavigationContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4">
            <div className="flex flex-1 items-center justify-end gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <NotificationBadge count={notificationCount} />
              </Button>
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto p-4">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AuthenticatedLayout;
